const fs = require('fs');
const path = require('path');
const stdout = process.stdout;

const dirName =  path.join(__dirname, 'secret-folder');

fs.readdir(dirName,
    (error, items) => {
        for (let i = 0; i < items.length; i++) {
            let file = dirName + '/' + items[i];
            let extnameFile = path.extname(items[i]);
            let fileName = items[i].substr(0, items[i].length - extnameFile.length)
            fs.stat(file, generate_callback(fileName, extnameFile.substr(1)));
        }
    }
);

function generate_callback(nameFile, extname) {
    return function(error, stats) {
        if(stats.isFile())
            stdout.write(`${nameFile} - ${extname} - ${stats['size'] / 1024}Kb\n`);
    }
};
