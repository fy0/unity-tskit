const { build } = require("esbuild");
const path = require("path");
const fs = require("fs");
const config = require('./build-config');


(async () => {
  try {
    const timerStart = Date.now();
    fs.rmSync(path.dirname(config.outfile), { recursive: true, force: true });

    await build(config)
    const timerEnd = Date.now();
    console.log(`🔨 Built in ${timerEnd - timerStart}ms.`)
    process.exit(0);
  } catch (e) {
  }
})()
