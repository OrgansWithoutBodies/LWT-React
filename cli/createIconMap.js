"use strict";
exports.__esModule = true;
var fs = require("fs");
function CreateIconMap() {
    var srcDirectoryRoot = './src/icons';
    var srcDirectory = srcDirectoryRoot + '/icn';
    var iconFiles = [];
    try {
        if (fs.existsSync(srcDirectory)) {
            var files = fs.readdirSync(srcDirectory);
            files.forEach(function (file) {
                if (file.endsWith('.png')) {
                    iconFiles.push('"' + file.split('.')[0] + '",');
                }
            });
            var namesString = iconFiles.reduce(function (prev, current) { return prev + current; }, '');
            var fileString = 'export const IconNameMap=[' + namesString + '] as const;';
            fs.writeFile(srcDirectoryRoot + '/index.ts', fileString, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
    catch (err) {
        console.error(err);
    }
}
exports["default"] = CreateIconMap;
CreateIconMap();
