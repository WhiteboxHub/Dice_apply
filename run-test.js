const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'cypress/fixtures/extracted');

// Function to get the list of files
const getFiles = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        });
    });
};

// Function to run Cypress tests
const runCypress = (file) => {
    return new Promise((resolve, reject) => {
        const command = `npx cypress run --env file="cypress/fixtures/extracted/${file}"`;
        const cypressProcess = exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error executing Cypress: ${err}`);
                return reject(err);
            }
            console.log(stdout);
            console.error(stderr);
            resolve();
        });

        // Listen for the 'exit' event to resolve the promise
        cypressProcess.on('exit', resolve);
    });
};

const processFiles = async () => {
    try {
        const files = await getFiles();
        for (const file of files) {
            await runCypress(file);
            console.log(`Finished processing file: ${file}`);
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }
};

processFiles();
