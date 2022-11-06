const fs = require('fs');
const promises = fs.promises;
const path = require('path');
const dirName =  path.join(__dirname, 'styles');

async function joinFile(dirName, newFile) {
    const charLine = process.platform === 'win32' ? '\r\n' : '\n';
    const writeStream =  fs.createWriteStream(newFile);
    const files = await promises.readdir(dirName);
    for (let file of files) {
        let stat = await promises.stat(path.join(dirName, file));
        if (stat.isFile()) {
            let extnameFile = path.extname(file);
            if (extnameFile === '.css') {
                const readStream = fs.createReadStream(path.join(dirName, file));
                for await (let data of readStream) {
                     writeData(writeStream, data);
                }
                writeData(writeStream, charLine);
            }
        }
    }
}

function writeData (writer, data) {
    return new Promise((resolve) => {
        writer.write(data);
        resolve();
    })
}

joinFile(dirName, path.join(__dirname, 'project-dist', 'bundle.css'));