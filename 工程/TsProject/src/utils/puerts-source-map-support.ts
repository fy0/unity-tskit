import { game } from 'csharp';
const puerts = require("puerts");


puerts.registerBuildinModule("path", {
  dirname(path) {
    return game.CSharpUtils._io_path_GetDirectoryName(path);
  },
  resolve(dir, url) {
        url = url.replace(/\\/g, "/");
        while (url.startsWith("../")) {
            dir = game.CSharpUtils._io_path_GetDirectoryName(dir);
            url = url.substr(3);
        }

        // console.log('!!!!', game.CSharpUtils._io_path_Combine(dir, url));
        return game.CSharpUtils._io_path_Combine(dir, url);
    },
});

puerts.registerBuildinModule("fs", {
    existsSync(path) {
        return game.CSharpUtils._io_file_Exists(path);
    },
    readFileSync(path) {
        return game.CSharpUtils._io_file_ReadAllText(path);
    },
});

(function () {
    let global = this ?? globalThis;
    global["Buffer"] = global["Buffer"] ?? {};
})();

require('source-map-support').install({
  retrieveSourceMap: function(source: string) {
    if (source.endsWith('bundle.js')) {
      const mapFn = game.CSharpUtils._io_path_Combine(game.Main.scriptPath, 'tsbuild/bundle.js.txt.map');

      if (game.CSharpUtils._io_file_Exists(mapFn)) {
        return {
          url: source,
          map: game.CSharpUtils._io_file_ReadAllText(mapFn)
        };
      }
    }
    return null;
  }
});
