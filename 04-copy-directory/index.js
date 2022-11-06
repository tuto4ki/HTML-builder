const fs = require('fs');
const promises = require('fs/promises');
const path = require('path');
const { mkdir, rmdir, copyFile } = promises;
const deleteFile = fs.promises.unlink;

async function createAssets (dirName, dirNameCopy) {
    await mkdir(dirNameCopy, { recursive: true });
    await deleteDirectory (dirNameCopy);
    await copyDirectory(dirName, dirNameCopy);
}

async function deleteDirectory (dirName) {
    const files = await promises.readdir(dirName);
    for(let file of files) {
        let stat = await promises.stat(path.join(dirName, file));
        if (stat.isFile()) {
            await deleteFile (path.join(dirName, file));
        }
        else {
            await deleteDirectory(path.join(dirName, file));
            await rmdir(path.join(dirName, file));
        }
    }
}

async function copyDirectory (dirName, dirNameCopy) {
    const files = await promises.readdir(dirName);
    for(let file of files) {
        let stat = await promises.stat(path.join(dirName, file));
        if (stat.isFile()) {
            await copyFile(path.join (dirName, file), path.join (dirNameCopy, file));
        }
        else {
            await mkdir (path.join (dirNameCopy, file), { recursive: true });
            await copyDirectory (path.join (dirName, file), path.join (dirNameCopy, file));
        }
    }
}

createAssets(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));