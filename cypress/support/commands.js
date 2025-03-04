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
Cypress.Commands.add('applyForJob', ({ jobId, timestamp }) => {
  cy.visit(`https://www.dice.com/job-detail/${jobId}`, { failOnStatusCode: false, timeout: 35000 })
    .then(() => {
      cy.get('body').then($body => {
        if ($body.text().includes('Sorry this job is no longer available. The Similar Jobs shown below might interest you.')) {
          // Job is no longer available
          cy.task('logApplicationInfo', `${timestamp} - Sorry, this job is no longer available for job ID: ${jobId}`);
          return cy.task('writeCSV', {
            filePath: 'cypress/fixtures/applied/job_applications.csv',
            data: { jobId, timestamp, status: 'no longer available' },
            headers: ['jobId', 'timestamp', 'status'],
            append: true
          }).then(() => {
            cy.log(`Moved to the next job ID after finding job ID ${jobId} as no longer available.`);
          });
        } else {
          // Check if the "Application Submitted" message is present
          // cy.get('.appViewed > .hydrated')
          cy.wait(15000);
          cy.get('.hydrated', { timeout: 15000 });
          cy.get('.hydrated').shadow().find('p').then($button => {
            if ($button.length > 0) {
              const buttonText = $button.text().trim();
              if (buttonText.includes('Application Submitted')) {
                // Application already submitted
                cy.task('logApplicationInfo', `${timestamp} - Application already submitted for job ID: ${jobId}`);
                return cy.task('writeCSV', {
                  filePath: 'cypress/fixtures/applied/job_applications.csv',
                  data: { jobId, timestamp, status: 'already applied' },
                  headers: ['jobId', 'timestamp', 'status'],
                  append: true
                }).then(() => {
                  cy.log(`Moved to the next job ID after finding job ID ${jobId} as already applied.`);
                });
              } else {
                // Handle apply button
                cy.wait(30000);
                cy.get('.hydrated').shadow().find('button').then($button => {
                  if ($button.length > 0) {
                    const buttonText = $button.text().trim();
                    if (buttonText.includes('Easy apply')) {
                      cy.task('logApplicationInfo', `${timestamp} - Easy apply button found for job ID: ${jobId}`);
                      cy.get('#applyButton > .hydrated').click({ timeout: 5000 });
                      cy.contains('span[data-v-5a80815f]', 'Next', { timeout: 3000 }).click();
                      cy.contains('span[data-v-5a80815f]', 'Submit', { timeout: 3000 }).click()
                        .then(() => {
                          cy.task('logApplicationInfo', `${timestamp} - Job with ID ${jobId} applied successfully.`);
                          return cy.task('writeCSV', {
                            filePath: 'cypress/fixtures/applied/job_applications.csv',
                            data: { jobId, timestamp, status: 'applied' },
                            headers: ['jobId', 'timestamp', 'status'],
                            append: true
                          });
                        });
                    } else {
                      const errorMessage = `${timestamp} - Unexpected button text found: "${buttonText}" for job ID: ${jobId}`;
                      cy.task('logApplicationError', errorMessage);
                      return cy.task('writeCSV', {
                        filePath: 'cypress/fixtures/applied/job_applications.csv',
                        data: { jobId, timestamp, status: 'fail' },
                        headers: ['jobId', 'timestamp', 'status'],
                        append: true
                      });
                    }
                  } else {
                    const errorMessage = `${timestamp} - Button not found for job ID: ${jobId}`;
                    cy.task('logApplicationError', errorMessage);
                    return cy.task('writeCSV', {
                      filePath: 'cypress/fixtures/applied/job_applications.csv',
                      data: { jobId, timestamp, status: 'fail' },
                      headers: ['jobId', 'timestamp', 'status'],
                      append: true
                    });
                  }
                });
              }
            }
          });
        }
      });
    });
});
