require('fs');
require('path');
const path = require("path");
const filePath = path.join(Cypress.config('downloadsFolder'), 'temp_email_data.txt');
let email;

describe('Login to novodaily and place a order', () => {
  it('Login to novodaily and place a order', () => {
    // Disable uncaught:exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    // Assuming there are input fields for username and password, and a login button
    cy.visit("https://novodaily:Test1234@dev-neu.novodaily.com/");
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
    cy.get('#birthdayDay').select('20');
    cy.get('#birthdayMonth').select('4');
    cy.get('#birthdayYear').select('1988');
    cy.get('#height').type('180');
    cy.get('#weight').type('80');
    cy.get('#desiredWeight').type('70');
    cy.get('#addressStreet').type('Connewitz 2');
    cy.get('#addressZipcode').type('04277')
    cy.get('#addressCity').type('Leipzig');
    cy.get('#addressCountry').select('Deutschland');
    cy.get('#phonenumber').type('01765678901');
    // Click Submit button
    cy.get('#confirmFormSubmit').click();
    cy.task('log', 'Submit pressed')
  })
})
