describe('End-to-End Test', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Log the error to the console for debugging purposes
      console.error('Uncaught exception detected:', err.message);
      // Returning false here prevents Cypress from failing the test due to uncaught exceptions
      return false;
    });
  });

  it('allows the user to log in and toggle subscription based on initial state', () => {
    // Directly visit the login page
    cy.visit('http://localhost:4321/news');


    // Wait for the navigation to complete and ensure the page has loaded
    cy.url().should('include', '/news');

    // Enter the email address
    cy.get('input[type="email"][name="email"]').type('cypresstest456@gmail.com');

    // Click the "Subscribe" button
    cy.get('button[type="submit"]#save').first().click();


    // Verify the subscription confirmation message
    cy.contains('Welcome to the Sing for Hope family! You have just taken a step towards transforming lives through the power of the arts. Stay tuned for inspiring stories, exciting events, and opportunities to make a difference with us.').should('be.visible');
 
    });
  });

