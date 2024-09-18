const fs = require('fs');
const path = require('path');

Cypress.Commands.add('captureConsoleLog', (message) => {
    cy.task('log', message);
});

Cypress.Commands.add('getLastConsoleLog', () => {
    return cy.task('getLastLog');
});
Cypress.Commands.add('addConsoleLog', (message) => {
    cy.task('addToLogs', message);
});
Cypress.Commands.add('clearConsoleLogs', () => {
    cy.task('clearLogs');
});

Cypress.Commands.add('getTempEmail', () => {
    cy.request({
        method: 'PUT',
        url: 'https://www.developermail.com/api/v1/mailbox',

    },cy.wait(2000)).then((response) => {
        expect(response.status).to.eq(200);
        let emailName = response.body.result.name;
        let token = response.body.result.token;
        let tempEmail = `${emailName}@developermail.com`;
        const data = {
            email: emailName,
            token: token
        };

        // Log the email and token (you can adapt this part as needed)
        cy.log(`Temporary Email: ${emailName}@developermail.com`);
        cy.log(`Token: ${token}`)
        const filePath = path.join(Cypress.config('fixturesFolder'), 'temp_email_data.txt');
        cy.writeFile(filePath,`${emailName}\n${token}`, 'utf-8');
        // Return the email and token for further use in your tests
        //return { email: tempEmail, token };
    });
});

 Cypress.Commands.add('getEmailIds', () => {
     const filePath = path.join(Cypress.config('fixturesFolder'), 'temp_email_data.txt');
     let email;
     let token;

     cy.readFile(filePath, 'utf-8').then((content) => {
         email = content.split('\n')[0].trim();
         token = content.split('\n')[1].trim();

         cy.request({
             method: 'GET',
             url: `https://www.developermail.com/api/v1/mailbox/${email}`,
             headers: {
                 'X-MailboxToken': token
             }
         },cy.wait(7000)).then((response) => {
             expect(response.status).to.eq(200);

             const messageIds = response.body.result;
             cy.log(`Email is: ${email}`);
             cy.log(`Token is: ${token}`);
             cy.log(`Message IDs: ${messageIds}`);
             const filePath = path.join(Cypress.config('fixturesFolder'), 'temp_email_data.txt');
             cy.writeFile(filePath, `${email}\n${token}\n${messageIds}`, 'utf-8');

         });
     });
});

function extractBodyAndLink(emailContent) {
    const bodyRegex = /<body>([\s\S]*?)<\/body>/i;
    const bodyMatch = emailContent.match(bodyRegex);

    let bodyText = '';

    if (bodyMatch && bodyMatch[1]) {
        bodyText = bodyMatch[1]
            .replace(/<[^>]+>/g, '')
            .replace(/=\r\n/g, '')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&')
            .trim();

    }

    return bodyText;
}

function extractConfirmationLink(emailContent) {
    const linkRegex = /href=3D"([^"]+)"/;
    const match = emailContent.match(linkRegex);
    if (match && match[1]) {
        return match[1]
            .replace(/=\r\n/g, '')
            .replace(/&amp;/g, '&')
            .replace(/=3D/g, '=');
    }
    return null;
}


Cypress.Commands.add('getEmailMessages', () => {
    const filePath = path.join(Cypress.config('fixturesFolder'), 'temp_email_data.txt');

    let email;
    let token;
    let messageIds;

    cy.readFile(filePath, 'utf-8').then((content) => {
        email = content.split('\n')[0].trim();
        token = content.split('\n')[1].trim();
        messageIds = content.split('\n')[2].trim();
        cy.log(`Email is: ${email}`);
        cy.log(`Token is: ${token}`);
        cy.log(`Message IDs are: ${messageIds}`);
        cy.request({
            method: 'GET',
            url: `https://www.developermail.com/api/v1/mailbox/${email}/messages/${messageIds}`,
            headers: {
                'X-MailboxToken': token
            }
        },cy.wait(7000)).then((response) => {
            expect(response.status).to.eq(200);

            const bodyText = extractBodyAndLink(response.body.result);
            const confirmationLink = extractConfirmationLink(response.body.result);
            cy.log(`Email Message is: ${bodyText}`);
            cy.log(`Email Confirmation Link is: ${confirmationLink}`);

            // Create the file path
            const filePath = path.join(Cypress.config('fixturesFolder'), 'emailContent.txt');

            // Write the content to the file
            cy.writeFile(filePath, `${bodyText}\n${confirmationLink}`, 'utf-8').then(() => {
                cy.log(`Email content saved to: ${filePath}`);
            });
        });
    });
});