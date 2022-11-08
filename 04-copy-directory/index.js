const path = require('path');
const fs = require('fs');

const pathToDir = path.join(__dirname, 'files');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
    if (err) throw err;
});

const pathToResultDir = path.join(__dirname, 'files-copy');

async function clearFolder() {
    try {
        const oldFiles = await fs.promises.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true });
        for (const oldFile of oldFiles) {
            fs.unlink(path.join(__dirname, 'files-copy', oldFile.name), err => {
                if (err) throw err;
            });
        }
        copyingFiles();

    } catch (err) {
        console.error(err);
    }
}


async function copyingFiles() {
    try {
        const files = await fs.promises.readdir(pathToDir, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(pathToDir, file.name);
            const resultFilePath = path.join(pathToResultDir, file.name);
            await fs.promises.copyFile(filePath, resultFilePath);
        }
    } catch (err) {
        console.error(err);
    }
};
clearFolder();
// copyingFiles();