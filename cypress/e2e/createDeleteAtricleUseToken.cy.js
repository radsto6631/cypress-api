/// <reference types="cypress" />

//before using token from commands.js
it.only('create and delete article', () => {
    cy.request({
        method: 'POST',
        url: 'https://api.example.com/api/users/login',
        body: {
            user: {
                email: "test@example.com",
                password: "password"
            }
        }
    }).then(response => {
        expect(response.status).to.eq(200);
        const token = 'Token ' + response.body.user.token;

        cy.request({
            method: 'POST',
            url: 'https://api.example.com/api/articles',
            headers: {
                Authorization: token
            },
            body: {
                article: {
                    title: "Test article",
                    description: "Description of test article",
                    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    tagList: ["test", "cypress"]
                }
            }
        }).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body.article.title).to.eq("Test article");
        })

    //login and create article through API, 
    // then visit the page and delete it through UI, 
    // finally check if it is deleted from the list of articles

    cy.visit("/");
    cy.contains('Sign in').click();
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();

    cy.contains('Test article').click();
    cy.intercept("GET", "**/articles*").as("getArticlesCall");
    cy.contains('button', 'Delete Article').click();

    cy.wait("@getArticlesCall");
    cy.get('app-article-list').should('not.contain', 'Test article');

    })
})

//after using token from commands.js

it.only('create and delete article using token', () => {
    cy.loginToApplication();

    cy.get("@token").then(token => {
        cy.request({
            method: 'POST',
            url: 'https://api.example.com/api/articles',
            headers: {'Authorization': token},
            body: {
                article: {
                    title: "Test article",
                    description: "Description of test article",
                    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    tagList: ["test", "cypress"]
                }
            }
        }).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body.article.title).to.eq("Test article");
        })

    cy.contains('Test article').click();
    cy.intercept("GET", "**/articles*").as("getArticlesCall");
    cy.contains('button', 'Delete Article').click();

    cy.wait("@getArticlesCall");
    cy.get('app-article-list').should('not.contain', 'Test article');

    })
})