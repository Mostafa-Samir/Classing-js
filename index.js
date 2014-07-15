var fs = require('fs');

var libraryFile = fs.readFileSync("./dist/classing.1.1.0.js", "utf-8");
eval(libraryFile);

module.exports = classing;