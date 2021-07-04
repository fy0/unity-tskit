const { build } = require("esbuild");
const config = require('./build-config');

(async () => {
  try {
    const timerStart = Date.now();
    await build(config)
    const timerEnd = Date.now();
    console.log(`🔨 Built in ${timerEnd - timerStart}ms.`)
    process.exit(0);
  } catch (e) {
  }
})()
