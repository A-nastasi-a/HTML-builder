const path = require('path');
const fs = require('fs');


const pathToDir = path.join(__dirname, 'secret-folder');
let list = [];

async function findFileNames() {
    try {
        const files = await fs.promises.readdir(pathToDir, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const wayToFile = path.join(pathToDir, file.name);
                const extention = path.extname(wayToFile).slice(1);
                const nameWithoutExt = path.parse(wayToFile).name;
                const stats = await fs.promises.stat(wayToFile);
                const resultString = `${nameWithoutExt} - ${extention} - ${stats.size / 1000}kb`;
                console.log(resultString);
            }
        }
    } catch (err) {
        console.error(err);
    }
};


findFileNames();