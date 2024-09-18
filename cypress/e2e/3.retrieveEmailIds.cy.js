require('fs');
require('path');
const path = require("path");
describe('Read Email IDs', () => {
    it('read temporary email ids', () => {
        cy.getEmailIds();
        const filePath = path.join(Cypress.config('fixturesFolder'), 'temp_email_data.txt');

        cy.readFile(filePath, 'utf8').then((content) => {
            
            let email = content.split('\n')[0].trim();
            let token = content.split('\n')[1].trim();
            let ids = content.split('\n')[2].trim();
            cy.task('log', `Email is : ${email}@developermail.com`);
            cy.task('log', `Token is : ${token}`);
            cy.task('log', `Email ID is : ${ids}`);
        });
    });
});