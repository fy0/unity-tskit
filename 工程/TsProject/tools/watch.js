const { startService } = require("esbuild");
const chokidar = require("chokidar");
const debounce = require('./_debounce.js');
const config = require('./build-config');


(async () => {
  const service = await startService();

	// `chokidar` watcher source changes.
	chokidar
		// Watches TypeScript and React TypeScript.
		.watch("src/**/*.{ts,tsx}", {
			interval: 0, // No delay
		})
		// Rebuilds esbuild (incrementally -- see `build.incremental`).
		.on("all", debounce(async (e, path) => {
      const timerStart = Date.now();
      try {
        await service.build(config)
      } catch (e) {
      }
      const timerEnd = Date.now();
      console.log(`🔨 Built in ${timerEnd - timerStart}ms.`)
    }, 500))

	// `liveServer` local server for hot reload.
	// liveServer.start({
	// 	// Opens the local server on start.
	// 	open: true,
	// 	// Uses `PORT=...` or 8080 as a fallback.
	// 	port: +process.env.PORT || 8080,
	// 	// Uses `public` as the local server folder.
	// 	root: "public",
	// })
})()
