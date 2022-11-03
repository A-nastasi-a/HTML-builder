const path = require('path');
const fs = require('fs');

const pathToText = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(pathToText);

const { stdout } = process;
readableStream.on('data', chunk => {
    const fromBufferToData = chunk.toString();
    stdout.write(fromBufferToData);
    process.exit();
})