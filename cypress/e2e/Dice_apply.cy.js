// cypress/integration/example.spec.js

describe('Apply for Jobs', () => {
    let files = [];

    beforeEach(() => {
        // Ensure session management is correctly set up
        cy.session('login', () => {
            cy.loginDice(); // Custom command to login
        });

        // Read all files from 'cypress/fixtures/extracted' directory
        cy.task('getFilesFromDirectory', 'cypress/fixtures/extracted').then((filePaths) => {
            files = filePaths;
        });
    });

    it("Applies for jobs using Easy Apply for each file", () => {
        // Iterate through each file
        cy.wrap(files).each((filePath) => {
            cy.readFile(filePath).then((data) => {
                const jobIds = data.ids; // Assuming JSON structure { "ids": [...] }

                // Iterate through each job ID and apply for job
                cy.wrap(jobIds).each((currentJobId) => {
                    cy.applyForJob(currentJobId); // Custom Cypress command to apply for the job
                });
            });
        });
    });
});
