const path = require('path');
const { format } = require('date-fns');

const resultsDir = 'cypress/fixtures/extracted/';
const logsDir = 'cypress/logs/';
const logFileName = `${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}Jobids.log`;

const ensureDirectoryExistence = (dir) => {
  cy.task('ensureDirectoryExistence', dir);
};

const logToFile = (message) => {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logMessage = `[${timestamp}] ${message}\n`;
  cy.log(logMessage);
  cy.writeFile(path.join(logsDir, logFileName), logMessage, { flag: 'a+', timeout: 20000 });
};

describe('Dice Jobs Scraper', () => {
  const keywords = Cypress.config('jobKeywords');

  before(() => {
    ensureDirectoryExistence(resultsDir);
    ensureDirectoryExistence(logsDir);
  });

  keywords.forEach((keyword) => {
    const jobIdsFileName = `${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}-${keyword}.json`;
    const filePath = path.join(resultsDir, jobIdsFileName);
    let jobIdSet = new Set();

    beforeEach(() => {
      cy.writeFile(path.join(logsDir, logFileName), `=== Starting Dice Jobs Scraper Tests for keyword: "${keyword}" ===\n`, { flag: 'a+' }, { timeout: 10000 });
      jobIdSet = new Set(); // Reset jobIdSet for each keyword
    });

    it(`should fetch jobs for "${keyword}"`, function () {
      logToFile(`Fetching jobs for keyword: "${keyword}"`);
      const pageSize = Cypress.config('pageCount');
      let start = 1;
      const increment = 100;
      let keepLooping = true;

      const performSearch = () => {
        if (!keepLooping) {
          logToFile(`Stopping search loop for keyword: "${keyword}"`);
          return;
        }

        cy.visitDiceJobsPage({ keyword, start, pageSize }).then(() => {
          cy.get('.card-title-link.normal', { timeout: 10000 }).each(($el) => {
            const jobId = $el.attr('id');
            if (jobId) {
              jobIdSet.add(jobId);
              logToFile(`Job ID ${jobId} added to set for keyword "${keyword}"`);
            }
          }).then(() => {
            if (Cypress.$('.card-title-link.normal').length === 0) {
              logToFile(`No more job cards found for keyword "${keyword}". Stopping.`);
              keepLooping = false;
            } else {
              start += increment;
              cy.wait(3000); // Increased delay to reduce load
              performSearch();
            }
          });
        });
      };

      performSearch();
    });

    afterEach(() => {
      const jobIds = Array.from(jobIdSet);
      if (jobIds.length > 0) {
        cy.task('writeJsonFile', { filePath, data: { ids: jobIds } })
          .then(() => {
            logToFile(`=== Job IDs saved to: ${filePath} ===`);
          });
      } else {
        logToFile('No job IDs collected to save.');
      }
    });

  });
});
