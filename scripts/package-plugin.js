const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const stageDir = path.join(distDir, 'package');
const zipPath = path.join(distDir, 'plugin.zip');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureCleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyRecursive(sourcePath, destinationPath) {
  const stat = fs.statSync(sourcePath);
  if (stat.isDirectory()) {
    fs.mkdirSync(destinationPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath)) {
      copyRecursive(
        path.join(sourcePath, entry),
        path.join(destinationPath, entry)
      );
    }
    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

function addOptionalPath(relativePath, includedPaths) {
  const sourcePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(sourcePath)) {
    return;
  }

  includedPaths.add(relativePath);
}

function main() {
  const packageJsonPath = path.join(repoRoot, 'package.json');
  const manifestPath = path.join(repoRoot, 'manifest.json');
  const mainJsPath = path.join(repoRoot, 'main.js');

  if (!fs.existsSync(mainJsPath)) {
    throw new Error('main.js not found. Run the build step before packaging.');
  }

  const packageJson = readJson(packageJsonPath);
  const manifest = readJson(manifestPath);
  if (manifest.main !== 'main.js') {
    throw new Error(`manifest.json must set "main" to "main.js". Found: ${manifest.main}`);
  }
  if (packageJson.version !== manifest.version) {
    throw new Error(
      `package.json version (${packageJson.version}) must match manifest.json version (${manifest.version})`
    );
  }

  fs.mkdirSync(distDir, { recursive: true });
  ensureCleanDir(stageDir);
  fs.rmSync(zipPath, { force: true });

  copyRecursive(manifestPath, path.join(stageDir, 'manifest.json'));
  copyRecursive(mainJsPath, path.join(stageDir, 'main.js'));

  const includedPaths = new Set();
  for (const defaultPath of ['assets', 'data', 'bin']) {
    addOptionalPath(defaultPath, includedPaths);
  }

  for (const extraPath of packageJson.dotxPlugin?.include || []) {
    if (typeof extraPath !== 'string' || !extraPath.trim()) {
      throw new Error('package.json dotxPlugin.include entries must be non-empty strings');
    }
    addOptionalPath(extraPath, includedPaths);
  }

  for (const relativePath of includedPaths) {
    copyRecursive(
      path.join(repoRoot, relativePath),
      path.join(stageDir, relativePath)
    );
  }

  const zip = new AdmZip();
  zip.addLocalFolder(stageDir);
  zip.writeZip(zipPath);

  console.log(`Created ${path.relative(repoRoot, zipPath)}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
