const fs = require('fs');
const promises = fs.promises;
const path = require('path');
const { mkdir, rmdir, copyFile } = promises;
const deleteFile = fs.promises.unlink;

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
/**
 * Create folder Assets
 */
    
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

/**
 * Create index.html
 */
async function createHtml (dirName, dirNameCopy) {
    const writeStream = fs.createWriteStream(path.join(dirNameCopy, 'index.html'));
    const readStream = fs.createReadStream(path.join(dirName, 'template.html'), 'utf-8');

    let indexData = '';
    for await (const chunk of readStream) {
        indexData = indexData + chunk;
    }
    
    let arrIndex = [];
    let temp = '';
    for(let i = 0; i < indexData.length; i++) {
        if (i == indexData.length - 1) {
            temp = temp + indexData[i];
            arrIndex.push(temp);
            break;
        }
        if (indexData[i] + indexData[i + 1] === '{{') {
            arrIndex.push(temp);
            temp = '{{';
            i++;
        }
        else if (indexData[i] + indexData[i + 1] === '}}') {
            arrIndex.push(temp + '}}');
            temp = '';
            i++;
        }
        else {
            temp = temp + indexData[i];
        }
    }
    
    for (let i = 0; i < arrIndex.length; i++) {
        if (/^{{[a-z0-9]+}}$/.test(arrIndex[i])) {
            let file = arrIndex[i].slice(2, arrIndex[i].length - 2) + '.html';
            /// try block if file don`t find
            try {
                readStreamHtml = fs.createReadStream(path.join(dirName, 'components', file), 'utf-8');
                for await (const item of readStreamHtml) {
                    await writeData(writeStream, item)
                }
            }
            catch(err) {
                console.log(err);
            }
        }
        else {
            await writeData(writeStream, arrIndex[i]);
        }
    }
}

function writeData (writer, data) {
    return new Promise((resolve) => {
        writer.write(data);
        resolve();
    })
}

const dirNameCopy = path.join(__dirname, 'project-dist');
mkdir (dirNameCopy, { recursive: true });

joinFile (path.join(__dirname, 'styles'), path.join(dirNameCopy, 'style.css'));

createAssets (path.join (__dirname, 'assets'), path.join(dirNameCopy, 'assets'));

createHtml (path.join(__dirname), dirNameCopy);