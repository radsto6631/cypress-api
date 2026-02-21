/// <reference types="cypress" />

it("E2E API test", () => {
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
                    title: "Test article Api Test",
                    description: "Description of test article",
                    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    tagList: ["test", "cypress"]
                }
            }
        }).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body.article.title).to.eq("Test article Api Test");
        })
    })

        cy.request({
            method: 'GET',
            url: 'https://api.example.com/api/articles?limit=10&offset=0',
            headers: {
                Authorization: token
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.articles[0].title).to.contain("Test article Api Test");
            const slugID = response.body.articles[0].slug;

            cy.request({
                method: 'DELETE',
                url: `https://api.example.com/api/articles/${slugID}`,
                headers: {
                    Authorization: token
                }
            }).then(response => {
                expect(response.status).to.eq(204);
        })
    })

    cy.request({
        method: 'GET',
        url: 'https://api.example.com/api/articles?limit=10&offset=0',
        headers: {
            Authorization: token
        }
    }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.articles[0].title).not.to.contain("Test article Api Test");
    })

})      
