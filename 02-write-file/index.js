const process = require('process');
const fs = require('fs');
const path = require('path');

const { stdout, stdin } = process;
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Введите данные\n');
stdin.on('data', data =>  {
    if (data.toString() == 'exit\n') 
        process.exit();
    else
        writeStream.write(data);
    });
process.on('exit', () => stdout.write('Удачи!\n'));