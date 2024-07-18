// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })




  
 Cypress.Commands.add('loginDice', () => {
    const username = Cypress.config("Dice_username");
    
    const password = Cypress.config("Dice_password");


    // Increase pageLoadTimeout for this specific visit\

    cy.visit('https://www.dice.com/dashboard/login');
  
    // Type username and password, then click submit button
    cy.get('input[placeholder="Please enter your email"][type="email"][name="email"]').type(username);
    cy.get('button[data-testid="sign-in-button"]').click().wait(2000);
    cy.get('input[placeholder="Enter Password"]').type(password);
    cy.get('button[data-testid="submit-password"]').click();
    cy.wait(5000);
    
  
    // Optionally, add assertions or further actions after login
});

Cypress.Commands.add('visitDiceJobsPage', ({ keyword, start, pageSize}) => {
    
    const url = `https://www.dice.com/jobs?q=${(keyword)}&page=${start}&pageSize=${pageSize}`;
    cy.log(url);
    cy.visit(url,{ failOnStatusCode: false });
    cy.wait(5000);
});
const path = require('path');
// commands.js
// Function to generate Dice search URL based on keyword, start, and end
// function generateDiceSearchUrl(keyword, start, end) {
//   const encodedKeyword = encodeURIComponent(keyword);
//   return https://www.dice.com/jobs?q=${encodedKeyword}&page=${start}&pageSize=${end};
// }

// // Adding the function to Cypress commands
// Cypress.Commands.add('generateDiceSearchUrl', (keyword, start, end) => {
//   return generateDiceSearchUrl(keyword, start, end);
// });
Cypress.Commands.add('applyForJob', ({ jobId, timestamp, status }) => {
  cy.visit(`https://www.dice.com/job-detail/${jobId}`, { failOnStatusCode: false })
    .then(() => {
      // Wait for the .hydrated element to be visible with a timeout
      cy.get('.hydrated', { timeout: 50000 }).should('be.visible', { timeout: 20000 });
    })
    .then(() => {
      // Wait an additional 10 seconds after the page is fully loaded
      cy.wait(25000); // Wait for 10 seconds
    })
    .then(() => {
      // Perform actions and assertions on the element
      cy.get('.hydrated').shadow().find('button').then(($button) => {
        if ($button.length > 0) {
          if ($button.text().includes('Applied')) {
            // Log info and write to CSV if job already applied
            cy.task('logApplicationInfo', `${timestamp} - Job with ID ${jobId} has already been applied.`);
            return cy.task('writeCSV', {
              filePath: 'cypress/fixtures/applied/job_applications.csv',
              data: { jobId, timestamp, status: 'already applied' },
              headers: ['jobId', 'timestamp', 'status'],
              append: true // Append data to existing CSV
            });
          } else if ($button.text().includes('Easy apply')) {
            // Log info and perform apply actions
            cy.task('logApplicationInfo', `${timestamp} - Easy apply button found for job ID: ${jobId}`);
            return cy.get('#applyButton > .hydrated').click({ timeout: 10000 })
              .then(() => cy.contains('span[data-v-5a80815f]', 'Next', { timeout: 10000 }).click())
              .then(() => cy.contains('span[data-v-5a80815f]', 'Submit', { timeout: 10000 }).click())
              .then(() => {
                cy.task('logApplicationInfo', `${timestamp} - Job with ID ${jobId} applied successfully.`);
                return cy.task('writeCSV', {
                  filePath: 'cypress/fixtures/applied/job_applications.csv',
                  data: { jobId, timestamp, status: 'applied' },
                  headers: ['jobId', 'timestamp', 'status'],
                  append: true // Append data to existing CSV
                });
              });
          } else if ($button.hasClass('seds-button') && $button.hasClass('seds-button-primary') && $button.hasClass('seds-button-medium')) {
            // Log info if the job is no longer available
            cy.task('logApplicationInfo', `${timestamp} - Sorry, this job is no longer available for job ID: ${jobId}`);
            return cy.task('writeCSV', {
              filePath: 'cypress/fixtures/applied/job_applications.csv',
              data: { jobId, timestamp, status: 'already applied' },
              headers: ['jobId', 'timestamp', 'status'],
              append: true // Append data to existing CSV
            });
          } else {
            // Handle unexpected button text
            const buttonText = $button.text().trim();
            const errorMessage = `${timestamp} - Unexpected button text found: "${buttonText}" for job ID: ${jobId}`;
            cy.task('logApplicationError', errorMessage);
            return cy.task('writeCSV', {
              filePath: 'cypress/fixtures/applied/job_applications.csv',
              data: { jobId, timestamp, status: 'fail' },
              headers: ['jobId', 'timestamp', 'status'],
              append: true // Append data to existing CSV
            });
          }
        } else {
          // Handle case where button is not found
          const errorMessage = `${timestamp} - Button not found for job ID: ${jobId}`;
          cy.task('logApplicationError', errorMessage);
          return cy.task('writeCSV', {
            filePath: 'cypress/fixtures/applied/job_applications.csv',
            data: { jobId, timestamp, status: 'fail' },
            headers: ['jobId', 'timestamp', 'status'],
            append: true // Append data to existing CSV
          });
        }
      });
    });
});
