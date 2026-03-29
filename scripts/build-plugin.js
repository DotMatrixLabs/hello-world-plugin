const path = require('path');
const esbuild = require('esbuild');

const repoRoot = path.resolve(__dirname, '..');

async function main() {
  await esbuild.build({
    entryPoints: [path.join(repoRoot, 'main.ts')],
    outfile: path.join(repoRoot, 'main.js'),
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node16',
    minify: true,
  });

  console.log('Built main.js');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
