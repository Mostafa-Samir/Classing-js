var fs = require('fs');

var libraryFile = fs.readFileSync(__dirname + "/dist/classing.1.1.2.js", "utf-8");
eval(libraryFile);

module.exports = classing;