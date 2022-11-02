const fs = require('fs');
const path = require('path');
const dirName =  path.join(__dirname, 'styles');


function joinFile(dirName) {  
    fs.readdir(dirName,
    
        async function (error, items) {
            const writeStream =  fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
            for (let i = 0; i < items.length; i++) { 
                let extnameFile = path.extname(items[i]);
                if (extnameFile === '.css') {
                    const readStream = new fs.ReadStream(path.join(__dirname, 'styles', items[i]), 'utf-8');
                    readStream.pipe(writeStream);
                    /*
                    let arr = [];
                    readStream.on('data', data => { arr.push(data); });
                    readStream.on('close', await function ()  {
                        for (let i = 0; i < arr.length; i++) {
                            writeStream.write(arr[i]);
                        }
                    });*/
                }
            }
        }
    );
}


joinFile(dirName);