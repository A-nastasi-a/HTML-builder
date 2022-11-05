const path = require('path');
const fs = require('fs');

const pathToFinalDir = path.join(__dirname, 'project-dist');
fs.mkdir(pathToFinalDir, { recursive: true }, err => {
    if (err) throw err;
});

const pathToTemplate = path.join(__dirname, 'template.html');

const readableStream = fs.createReadStream(pathToTemplate, 'utf-8');
let operationsCounter = 0;
let styleOpCounter = 0;
let templateData = "";
let newTemplate = "";
let stylesFull = "";

let splittedTemplate = [];
let listWithStyles = [];
readableStream.on('data', chunk => templateData += chunk);


async function writeTemplate() {
    try {
        const templateFinalPath = path.join(pathToFinalDir, 'index.html');
        fs.writeFile(
            templateFinalPath,
            newTemplate,
            (err) => {
                if (err) throw err;
            }
        )
    } catch (err) {
        console.error(err);
    }
}

async function tagChange() {
    try {
        const files = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                let listWithInfo = [];
                const pathToCompFile = path.join(__dirname, 'components', file.name);
                const fileExt = path.extname(pathToCompFile).slice(1);
                if (fileExt === 'html') {
                    const nameWithoutExt = path.parse(pathToCompFile).name;
                    listWithInfo.push(nameWithoutExt);
                    const readableStreamComp = fs.createReadStream(pathToCompFile, 'utf-8');
                    let compInfo = "";
                    readableStreamComp.on('data', chunk => compInfo += chunk);
                    readableStreamComp.on('end', () => {
                        const tagPos = splittedTemplate.indexOf(nameWithoutExt);
                        splittedTemplate.splice(tagPos, 1, compInfo);
                        operationsCounter++;
                        if (operationsCounter == 3) {
                            newTemplate = splittedTemplate.join('\r\n');
                            writeTemplate();
                        }
                    })
                }
            }
        };
    } catch (err) {
        console.error(err);
    }
};

async function writeStyles() {
    try {
        const styleFinelPath = path.join(pathToFinalDir, 'style.css');
        for (let piese of listWithStyles) {
            fs.writeFile(
                styleFinelPath,
                stylesFull,
                (err) => {
                    if (err) throw err;
                }
            )
        }
    } catch (err) {
        console.error(err);
    }
}

async function createStyles() {
    try {
        const styleFiles = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
        for (const file of styleFiles) {
            if (file.isFile()) {
                const pathToFile = path.join(__dirname, 'styles', file.name);
                const fileExt = path.extname(pathToFile).slice(1);
                if (fileExt === 'css') {
                    const readableStream = fs.createReadStream(pathToFile);
                    readableStream.on('data', chunk => {
                        listWithStyles.push(chunk.toString());
                    });
                    readableStream.on('end', () => {
                        styleOpCounter++;
                        if (styleOpCounter === 3) {
                            stylesFull = listWithStyles.join('\n');
                            writeStyles();
                        }
                    })
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function copyFolder() {
    try {
        fs.mkdir(path.join(pathToFinalDir, 'assets'), { recursive: true }, err => {
            if (err) throw err;
        });
        const assetFolders = await fs.promises.readdir(path.join(__dirname, 'assets'), { withFileTypes: true });
        for (const folder of assetFolders) {
            if (folder.isDirectory()) {
                fs.mkdir(path.join(pathToFinalDir, 'assets', folder.name), { recursive: true }, err => {
                    if (err) throw err;
                });
                const assetFiles = await fs.promises.readdir(path.join(__dirname, 'assets', folder.name), { withFileTypes: true });
                for (file of assetFiles) {
                    const filePath = path.join(__dirname, 'assets', folder.name, file.name);
                    const finalFilePath = path.join(pathToFinalDir, 'assets', folder.name, file.name);
                    await fs.promises.copyFile(filePath, finalFilePath);

                }

            }
        }
    } catch (err) {
        if (err) throw err;
    }
}


readableStream.on('end', () => {
    templateData = templateData.split('{{');
    for (let i of templateData) {
        if (i.indexOf('}}') < 0) {
            splittedTemplate.push(i);
        } else {
            i = i.split('}}');
            splittedTemplate.push(...i);
        }
    }
    tagChange();
});
createStyles();
copyFolder();