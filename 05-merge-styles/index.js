const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'styles');
const pathToFinalFolder = path.join(__dirname, 'project-dist');
let finalStyle = "";
let listWithData = [];
let counterOfOperations = 0;

async function writeToFile() {
    try {
        const outputPath = path.join(pathToFinalFolder, 'bundle.css');
        for (let code of listWithData) {
            fs.writeFile(
                outputPath,
                finalStyle,
                (err) => {
                    if (err) throw err;
                }
            );
        }
    } catch (err) {
        console.error(err);
    }
}

async function getAndUnite() {
    try {
        const files = await fs.promises.readdir(pathToFolder, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const pathToFile = path.join(pathToFolder, file.name);
                const fileExt = path.extname(pathToFile).slice(1);
                if (fileExt === 'css') {
                    const readableStream = fs.createReadStream(pathToFile);
                    readableStream.on('data', chunk => {
                        listWithData.push(chunk.toString());
                    });
                    readableStream.on('end', () => {
                        counterOfOperations++;
                        if (counterOfOperations === 3) {
                            finalStyle = listWithData.join('\n');
                            writeToFile();
                        }
                    })
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
};

getAndUnite();