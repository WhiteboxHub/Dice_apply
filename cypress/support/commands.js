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
    cy.visit(url);
    cy.wait(5000);
});

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


Cypress.Commands.add('applyForJob', (jobId) => {
    cy.visit(`https://www.dice.com/job-detail/${jobId}`)
      .then(() => {
        return cy.wait(15000); // Adjust the wait time as necessary
      })
      .get('.hydrated') // Selects an element with class 'hydrated'
      .shadow() // Accesses the shadow DOM within the selected element
      .find('button')
      .then(($button) => {
        if ($button.length > 0 && $button.text().includes('Applied')) {
          const errorMessage = `Job with ID ${jobId} has already been applied.`;
          cy.logError(errorMessage);
        } else if ($button.length > 0 && $button.text().includes('Easy apply')) {
          cy.logInfo(`Easy apply button found for job ID: ${jobId}`);
          return cy.get('#applyButton > .hydrated').click()
            .then(() => {
              return cy.contains('span[data-v-5a80815f]', 'Next', { timeout: 10000 }).click();
            })
            .then(() => {
              return cy.contains('span[data-v-5a80815f]', 'Submit', { timeout: 10000 }).click();
            });
        } else if ($button.length > 0 && $button.hasClass('seds-button') && $button.hasClass('seds-button-primary') && $button.hasClass('seds-button-medium')) {
          cy.logInfo(`Button with class '.seds-button.seds-button-primary.seds-button-medium' found for job ID: ${jobId}`);
        } else if ($button.length > 0) {
          const buttonText = $button.text().trim();
          const errorMessage = `Unexpected button text found: "${buttonText}" for job ID: ${jobId}`;
          cy.logError(errorMessage);
        } else {
          const errorMessage = `Button not found for job ID: ${jobId}`;
          cy.logError(errorMessage);
        }
      });
  });
  