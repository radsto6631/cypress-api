// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginToApplication', () => {
    cy.request({
        method: 'POST',
        url: 'https://api.example.com/api/users/login',
        body: {
            user: {
                email: "test@example.com",
                password: "password234"
            }
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        const token = response.body.user.token;
        cy.wrap(token).as("token");
        cy.visit("/", {
            onBeforeLoad(window){
                window.localStorage.setItem("jwtToken", token);
            }
        });
    });
})

// This is the same command as above, but instead of using API call, it uses UI to login
// Cypress.Commands.add('loginToApplication', () => {
//     cy.visit("/");
//     cy.contains('Sign in').click();
//     cy.get('input[name="email"]').type("test@example.com");
//     cy.get('input[name="password"]').type("password");
//     cy.get('button[type="submit"]').click();
// })