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

it("E2E API test 2", () => {

  // Test data - keeping it in a variable makes validation easier and reusable
  const title = "Test article Api Test";

  // STEP 1: Authenticate user to receive access token
  // We cannot create/delete articles without authorization
  cy.request({
    method: "POST",
    url: "https://api.example.com/api/users/login",
    body: {
      user: {
        email: "test@example.com",
        password: "password",
      },
    },
  }).then((loginRes) => {

    // Always validate status code first
    expect(loginRes.status).to.eq(200);

    // Extract token from response body
    // Token is required for all protected endpoints
    const token = "Token " + loginRes.body.user.token;

    // STEP 2: Create a new article using the token
    cy.request({
      method: "POST",
      url: "https://api.example.com/api/articles",
      headers: { 
        Authorization: token  // pass token in header
      },
      body: {
        article: {
          title,
          description: "Description of test article",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          tagList: ["test", "cypress"],
        },
      },
    }).then((createRes) => {

      // Validate article was successfully created
      expect(createRes.status).to.eq(201);

      // Confirm backend returned correct article title
      expect(createRes.body.article.title).to.eq(title);
    });

    // STEP 3: Fetch articles to confirm the new article exists in the list
    // This simulates what a real client would do
    cy.request({
      method: "GET",
      url: "https://api.example.com/api/articles?limit=10&offset=0",
      headers: { Authorization: token },
    }).then((getRes) => {

      expect(getRes.status).to.eq(200);

      // Validate the article appears in API response
      expect(getRes.body.articles[0].title).to.contain(title);

      // Extract the slug (unique identifier) needed for deletion
      const slugID = getRes.body.articles[0].slug;

      // STEP 4: Delete the created article using its slug
      // Backticks allow dynamic URL construction
      cy.request({
        method: "DELETE",
        url: `https://api.example.com/api/articles/${slugID}`,
        headers: { Authorization: token },
      }).then((deleteRes) => {

        // 204 = successfully deleted, no content returned
        expect(deleteRes.status).to.eq(204);
      });

      // STEP 5: Final validation
      // Confirm the deleted article no longer exists
      cy.request({
        method: "GET",
        url: "https://api.example.com/api/articles?limit=10&offset=0",
        headers: { Authorization: token },
      }).then((finalGetRes) => {

        expect(finalGetRes.status).to.eq(200);

        // Ensure the title is NOT in the response anymore
        expect(finalGetRes.body.articles[0].title)
          .not.to.contain(title);
      });
    });
  });
});
