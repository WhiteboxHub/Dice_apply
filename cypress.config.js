const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    baseUrl: "https://www.dice.com/",
    includeShadowDom: true,
    pageLoadTimeout: 100000,
    defaultCommandTimeout: 10000,
    pageCount: 20,
    Dice_username:"jyotitambe063@gmail.com",
    Dice_password:"Innovapath1",
    chromeWebSecurity: false,
    jobKeywords: [

        "Quality Assurance",
"QA Automation",
"Automation",
"QA Engineer",
"Software Testing",
"Test Automation",
"Manual Testing",
"Automated Testing",
"Selenium",
"Selenium Webdriver",
"Webdriver.io",
"Cypress",
"JUnit",
"TestNG",
"REST API Testing",
"Postman",
"Performance Testing",
"Load Testing",
"Functional Testing",
"Regression Testing",
"Integration Testing",
"Continuous Integration (CI)",
"Continuous Deployment (CD)",
"Appium",
"Jenkins",
"Git",
"Agile",
"Scrum",
"Bug Tracking",
"Defect Management",
"Test Case Management",
"Test Plans",
"Test Scripts",
"Test Cases",
"TDD",
"BDD",
"Jira",
"MYSQL",
"Database Testing",
"Smoke Testing",
"Sanity Testing",
"JavaQA"








      //UI,


//         "HTML5",
// "CSS3",
// "SASS",
// "JavaScript (ES5/ES6/ES7/ES8)",
// "ReactJS",
// "React Native",
// "Redux",
// "React Router",
// "Bootstrap",
// "jQuery",
// "D3.js",
// "Responsive Design",
// "Single Page Application (SPA)",
// "UI Design",
// "Functional Programming",
// "Object-Oriented Programming",
// "Webpack",
// "Grunt",
// "Jest",
// "Enzyme",
// "Async/Await",
// "Redux Thunk",
// "Redux Form",
// "Material-UI",
// "Google Fonts",
// "SVG",
// "RESTful API",
// "React Hooks (useState, useEffect, useContext, useMemo, useRef, useReducer)",
// "JSX",
// "DOM Manipulation",
// "State Management",
// "CSS Preprocessors",
// "Media Queries",
// "Fluid Layout",
// "Typography",
// "Jasmine",
// "Nightwatch.js",
// "JSON",
// "AJAX",
// "jQuery UI",
// "UI-Router",
// "Custom Directives",
// "DOM Traversal",
// "Event Handling",


 //ml,
      // "Artificial Intelligence",
      // "AI Engineer",
      // "Data Scientist",
      // "Data Science",
      // "ML Researcher",
      // "Deep Learning Engineer",
      // "Data Analyst",
      // "AI Researcher",
      // "NLP Engineer",
      // "Computer Vision Engineer",
      // "Data Mining Specialist",
      // "Statistical Analyst",
      // "Quantitative Analyst",
      // "Predictive Modeler",
      // "AI/ML Developer",
      // "LLM Specialist",
      // "Machine Learning Engineer",
      // "Machine Learning",
      // "Applied Scientist",
      // "Research Scientist",
      // "ML Ops Engineer",
      // "AI Solutions Architect",
      // "Machine Learning Developer",
      // "AI/ML Consultant",
      // "Business Intelligence Analyst",
      // "Analytics Engineer",
      // "Data Science Manager"
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
