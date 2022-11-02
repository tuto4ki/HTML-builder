const fs = require('fs');
const path = require('path');
const mkdir = fs.promises.mkdir;
const { copyFile, constants } = fs.promises;

async function copyDir () {
  const dirName =  path.join(__dirname, 'files');
  const dirNameCopy = path.join(__dirname, 'filesCopy');
  const createDir = await mkdir(dirNameCopy, { recursive: true });
}

copyDir();