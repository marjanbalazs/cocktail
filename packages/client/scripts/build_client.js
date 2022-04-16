const esbuild = require('esbuild');

console.log(process.cwd());

esbuild.build({
    treeShaking: true,
    minify: true,
    outdir: "./../../dist/static",
    entryPoints: ["./src/app.tsx"],
    bundle: true,
    platform: 'browser',
})
  .then(() => console.log("Client built!"))
  .catch(e => {
  console.error(e);
  process.exit(1);
  });