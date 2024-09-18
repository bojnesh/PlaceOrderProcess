# PlaceOrderProcess
 
 Run installation of dependancies
 
 `npm install`

To open Cypress run in terminal window

`npx cypress open`

.. once Cypress opens up

![image](https://github.com/user-attachments/assets/08b21557-12b0-433e-a467-ea4d3a5dfb9c)

.. click on E2E Testing

![image](https://github.com/user-attachments/assets/0bb0fabc-4763-42cd-82b5-9f65b9d16dc4)

.. choose the Browser on witch u want to run the tests

![image](https://github.com/user-attachments/assets/903675bc-fd75-4613-8428-b7d0bcd15b29)

.. click Start E2E Testing on desired browser
![image](https://github.com/user-attachments/assets/884a72db-ecbd-4b7a-9bbb-f2f8de5794dc)


# Console running

To create a temporary email run
`npm run create-temp-email`

Test will generate a temp_email_data.txt in cypress/fixtures folder

.. to place an order
`npm run place-order`

.. to retrive email ids
`npm run retrive-email-ids`

Test will add email ids to temp_email_data.txt in cypress/fixtures folder

.. to read email
`npm run read-email`

Test will generate a emailContent.txt in cypress/fixtures folder witch will contain email text and the confirmation link
