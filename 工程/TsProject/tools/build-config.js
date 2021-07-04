
module.exports = {
  // Bundles JavaScript.
  bundle: true,
  // Defines env variables for bundled JavaScript; here `process.env.NODE_ENV`
  // is propagated with a fallback.
  // define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development") },
  // Bundles JavaScript from (see `outfile`).
  entryPoints: ["src/index.ts"],
  // Uses incremental compilation (see `chokidar.on`).
  incremental: true,
  // Removes whitespace, etc. depending on `NODE_ENV=...`.
  minify: process.env.NODE_ENV === "production",
  // Bundles JavaScript to (see `entryPoints`).
  outfile: "../UnityProject/Assets/Resources/tsbuild/bundle.js.txt",
  // Others
  platform: "node",
  tsconfig: "./tsconfig.json",
  color: true,
  sourcemap: process.env.NODE_ENV === "production" ? false : true,
  external: ['csharp', 'puerts'],
  target: 'es2020',
  treeShaking: true,
  logLevel: 'error'
}
