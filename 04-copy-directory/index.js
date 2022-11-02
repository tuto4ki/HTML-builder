const fs = require('fs');
const path = require('path');

async function copyDir () {
    const mkdir = fs.promises.mkdir;
    const copyFile = fs.promises.copyFile;
    const deleteFile = fs.unlink;
    const dirName =  path.join(__dirname, 'files');
    const dirNameCopy = path.join(__dirname, 'filesCopy');
    await mkdir(dirNameCopy, { recursive: true });
    fs.readdir(dirNameCopy,
        (error, items) => {
            for (let i = 0; i < items.length; i++) {
                deleteFile(path.join(dirNameCopy, items[i]), error => {if(error) throw error; ''});
            }
    });
          
    fs.readdir(dirName,
        (error, items) => {
            for (let i = 0; i < items.length; i++) {
                copyFile(path.join(dirName, items[i]), path.join(dirNameCopy, items[i]));
            }
        }
    );
}

copyDir();