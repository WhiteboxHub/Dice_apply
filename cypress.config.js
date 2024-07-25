const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "https://www.dice.com/",
    includeShadowDom: true,
    pageLoadTimeout: 100000,
    defaultCommandTimeout: 10000,
    pageCount: 20,
    Dice_username:"",
    Dice_password:"",
    chromeWebSecurity: false,
    jobKeywords: [
    
      "Artificial Intelligence",
      "AI Engineer",
      "Data Scientist",
      "Data Science",
      "ML Researcher",
      "Deep Learning Engineer",
      "Data Analyst",
      "AI Researcher",
      "NLP Engineer",
      "Computer Vision Engineer",
      "Data Mining Specialist",
      "Statistical Analyst",
      "Quantitative Analyst",
      "Predictive Modeler",
      "AI/ML Developer",
      "LLM Specialist",
      "Machine Learning Engineer",
      "Machine Learning",
      "Applied Scientist",
      "Research Scientist",
      "ML Ops Engineer",
      "AI Solutions Architect",
      "Machine Learning Developer",
      "AI/ML Consultant",
      "Business Intelligence Analyst",
      "Analytics Engineer",
      "Data Science Manager"
    ],
    setupNodeEvents(on, config) {
      // Load plugins file for custom tasks
      require('./cypress/plugins/index')(on, config);
      // Return the updated config
      return config;
    }
  },
  // implement node event listeners here
});
