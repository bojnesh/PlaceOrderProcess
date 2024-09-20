require('fs');
require('path');

const path = require("path");
const filePath = path.join(Cypress.config("fixturesFolder"), 'temp_email_data.txt');
let email;

describe('Login to novodaily and place a order', () => {
  beforeEach(() => {
    // Assuming there are input fields for username and password, and a login button
    cy.visit("https://novodaily:Test1234@dev-neu.novodaily.com/");
  });
  it('Login to novodaily and place a order', () => {
    Cypress.on('url:changed', (newUrl) => {
      console.log(newUrl);
    });
    // Disable uncaught:exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })

    cy.task('log', 'Login page opened')
    // Order Standard package
    cy.get(':nth-child(2) > .cms-element-text > :nth-child(4) > .btn').click();
    // Subscribe
    cy.get('.col-8 > .btn').click();
    // Continue as a Guest
    cy.get('.offcanvas-cart > :nth-child(6) > .btn-primary').click();
    // Read tempEmail from file and add it to email field
    cy.readFile(filePath, 'utf-8').then((content) => {
      email = content.split('\n')[0].trim();
      cy.get("#guestEmail").click().type(email+'@developermail.com');
    });

    cy.task('log','Filling in the required data')
    // Fill in required fields
    cy.get('#salutation').select('Herr');
    cy.get('#firstName').type('AT-Nash');
    cy.get('#lastName').type('AT-Test');
    cy.get('#gender').select('m');
    cy.get('#birthdayDay').select('17');
    cy.get('#birthdayMonth').select('4');
    cy.get('#birthdayYear').select('1988');
    cy.get('#height').type('172');
    cy.get('#weight').type('89');
    cy.get('#desiredWeight').type('75');
    cy.get('#addressStreet').type('Connewitz 2');
    cy.get('#addressZipcode').type('04277')
    cy.get('#addressCity').type('Leipzig');
    cy.get('#addressCountry').select('Deutschland');
    cy.get('#phonenumber').type('01765678901');

    // Click Submit button
    cy.get('#confirmFormSubmit').click();

    // Click Confirm order
    cy.get('.checkout-confirm-tos-label').click();
    cy.get('#confirmFormSubmit').click().wait(2000);

    // Fill in payment details
    cy.get('#card-number > div > iframe')
        .should('be.visible')
        .then(($iframe) => {
          const $body = $iframe.contents().find('body');

        cy.wrap($body)
            .find('#cardNumber')
            .type('5434511352783949');
        });
    cy.get('#card-holder-name > div > iframe')
        .should('be.visible')
        .then(($iframe) => {
          const $body = $iframe.contents().find('body');

          cy.wrap($body)
              .find('#cardHolder')
              .type('Gloria Feil');
        });
    cy.get('#expiry-date > div > iframe')
        .should('be.visible')
        .then(($iframe) => {
          const $body = $iframe.contents().find('body');

          cy.wrap($body)
              .find('#expiryDate')
              .type('04/25');
        });
    cy.get('#cvv > div > iframe')
        .should('be.visible')
        .then(($iframe) => {
          const $body = $iframe.contents().find('body');
          cy.wrap($body)
              .find('#verificationCode')
              .type('970');
        });
    cy.get('#submit-button').click();

    //Final page
      cy.get(':nth-child(2) > .checkbox > .checkbox__input').click();
      cy.get('.button').click();
      cy.wait(3000);
    cy.contains('Vielen Dank für Deine Bestellung bei NovoDaily!').should('be.visible');
  });
});
