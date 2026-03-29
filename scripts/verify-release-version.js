const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
  );
}

function main() {
  const packageJson = readJson('package.json');
  const manifest = readJson('manifest.json');
  const releaseTag = process.env.RELEASE_TAG || '';

  if (packageJson.version !== manifest.version) {
    throw new Error(
      `Version mismatch: package.json=${packageJson.version}, manifest.json=${manifest.version}`
    );
  }

  if (manifest.main !== 'main.js') {
    throw new Error(`manifest.json must reference main.js. Found: ${manifest.main}`);
  }

  if (releaseTag) {
    const acceptedTags = new Set([manifest.version, `v${manifest.version}`]);
    if (!acceptedTags.has(releaseTag)) {
      throw new Error(
        `Release tag ${releaseTag} must match ${manifest.version} or v${manifest.version}`
      );
    }
  }

  console.log(`Verified release version ${manifest.version}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
