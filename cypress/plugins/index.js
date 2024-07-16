const fs = require('fs-extra');
const path = require('path');

// Function to ensure directory exists for a given file path
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  fs.ensureDirSync(dirname); // Ensure the directory exists
}

module.exports = (on, config) => {
  // Register Cypress tasks
  on('task', {
    ensureDirectoryExistence(filePath) {
      ensureDirectoryExistence(filePath);
      return null;
    },
    readJsonFile: async (filePath) => {
      return fs.readJson(filePath);
    },
    writeJsonFile: async ({ filePath, data }) => {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeJson(filePath, data, { spaces: 2 });
      return null;
    },
    logInfo(message) {
      const logPath = path.join(__dirname, '..', 'cypress', 'logs', 'info.log');
      ensureDirectoryExistence(logPath);
      appendToFile(logPath, message);
      return null;
    },
    logError(message) {
      const logPath = path.join(__dirname, '..', 'cypress', 'logs', 'error.log');
      ensureDirectoryExistence(logPath);
      appendToFile(logPath, message);
      return null;
    }
  });

  // Return config to plugins file
  return config;
};
