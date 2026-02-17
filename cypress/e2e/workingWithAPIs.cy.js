/// <reference types="cypress" />

it("first API test", () => {

    cy.intercept("GET", "https://api.example.com/api/tags", { fixture: "tags.json" });
    //same as above
    cy.intercept("GET", "**/tags", { fixture: "tags.json" });
    //same as above
    cy.intercept({method: "GET", pathname: "tags"}, { fixture: "tags.json" });
    
    cy.intercept("GET", "https://api.example.com/api/articles?limit=10&offset=0",
        { fixture: "articles.json" });
    
    cy.visit("/");
    cy.contains('Sign in').click();
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();
});

it("modify API response", () => {

    cy.intercept("GET", "https://api.example.com/api/tags", (req) => {
        req.continue(res => {
            res.body.articles[0].title = "Modified Title";
            res.send(res.body);
        });
    });

    cy.visit("/");
    cy.contains('Sign in').click();
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();
    cy.get('.article-preview').first().find('h1').should('have.text', 'Modified Title');
});

it("waiting for apis", () => {
    cy.intercept("GET", "**/articles*").as("getArticlesCall");

    cy.visit("/");
    cy.contains('Sign in').click();
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();

    //this will wait until the API call is made and response is 
    // received, then it will continue with the next steps
    cy.wait("@getArticlesCall");

    cy.get('app-article-list').invoke('text').then(allArticleTexts => {
        expect(allArticleTexts).to.include("Test Article");
    });
})

it("waiting for apis 2", () => {
    cy.intercept("GET", "**/articles*").as("getArticlesCall");

    cy.visit("/");
    cy.contains('Sign in').click();
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password");
    cy.get('button[type="submit"]').click();

    //this will wait until the API call is made and Test Article is
    //  received, then it will continue with the next steps
    cy.wait("@getArticlesCall").then( apiArticleObject => {
        console.log(apiArticleObject)
        expect(apiArticleObject.response.body.articles[0].title).to.contain("Test Article");
    });

    cy.get('app-article-list').invoke('text').then(allArticleTexts => {
        expect(allArticleTexts).to.include("Test Article");
    });
})