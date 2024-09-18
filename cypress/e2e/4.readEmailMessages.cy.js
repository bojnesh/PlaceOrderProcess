require('fs');
require('path');
const path = require("path");
describe('read email messages', () => {
    it('read temporary email messages and extract the confirmation link', () => {
        cy.getEmailMessages();
        const filePath = path.join(Cypress.config('fixturesFolder'), 'emailContent.txt');

        cy.readFile(filePath, 'utf8').then((content) => {
            
            cy.task('log', `Email content is : \n\n${content}`);
        });
    });
});