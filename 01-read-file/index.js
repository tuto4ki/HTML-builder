const fs = require('fs');
const path = require('path');

const { stdout } = process;
const readStream = new fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';

readStream.on('data', chunk => data += chunk);
readStream.on('end', () => stdout.write(data));
readStream.on('error', error => stdout.write('Error', error.message));