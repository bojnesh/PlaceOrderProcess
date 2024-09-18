const fs = require('fs');
const path = require('path');
module.exports = {
  e2e: {
    setupNodeEvents(on) {
      let logs = [];
      on('task', {
            log(message) {
              console.log(message);
                return null;
            },
            addToLogs(message) {
              logs.push(message);
              return null;
            },
          getLastLog: function () {
              return logs[1];
          },
        clearLogs() {
          logs = [];
          return null;
        },
      });
    },
  },
  chromeWebSecurity: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
};
