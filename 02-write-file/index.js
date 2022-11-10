const path = require('path');
const fs = require('fs');

const pathToText = path.join(__dirname, 'text.txt');

const writeToFile = fs.createWriteStream(pathToText);
const { stdin, stdout } = process;

stdout.write('Приветствую!\nВведите что-нибудь:\n');
stdin.on('data', data => {
    const textData = data.toString();
    if (textData.indexOf('exit') > -1) {
        console.log('До свидания!');
        process.exit();
    } else {
        fs.appendFile(
            pathToText,
            textData,
            (err) => {
                if (err) throw err;
            }
        )
    }
});
process.on('SIGINT', () => {
    console.log('До свидания!');
    process.exit();
});