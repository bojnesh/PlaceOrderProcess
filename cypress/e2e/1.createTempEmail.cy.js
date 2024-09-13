require('fs');
require('path');
const path = require("path");
describe('Create a temporary email using developermail.com API', () => {

    it('GET create a new temp email,and store in temp_email_data.txt', () => {
        cy.getTempEmail();

        const filePath = path.join(Cypress.config('downloadsFolder'), 'temp_email_data.txt');

        cy.readFile(filePath, 'utf8').then((content) => {
            cy.task('log', 'Content of temp_email_data.txt:')
            let email = content.split('\n')[0].trim();
            let token = content.split('\n')[1].trim();
            cy.task('log', `Email is : ${email}@developermail.com`);
            cy.task('log', `Token is : ${token}`);

        });
    });
});