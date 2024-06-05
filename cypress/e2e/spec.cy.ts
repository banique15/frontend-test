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
    cy.visit('http://localhost:4321/login');

    // Fill in the login credentials and submit the form
    cy.get('input#email').type('javierhinojosame@gmail.com');
    cy.get('input#password').type('Stewart123!');
    cy.get('form#login-form').submit();

    // After login, navigate directly to the preferences page
    cy.get('div[role="button"]').contains('App').click();

    // Wait for the dropdown to become visible and click the "Preferences" link
    cy.contains('a', 'Preferences').click({force: true}); // Using force: true to click on potentially hidden elements

    // Add assertions or further actions here, such as verifying the URL or checking page content
    cy.url().should('include', '/preferences');

    // Wait for the toggle button to be visible and check its initial state
    cy.get('#toggleButton', { timeout: 30000 }).should('be.visible').invoke('attr', 'aria-checked').then((isChecked) => {
      const initialState = isChecked === 'true';


      // Click the toggle button to change the subscription status
      cy.get('#toggleButton').click();

      // Verify the toggle action by checking if the aria-checked attribute has been updated
      cy.get('#toggleButton').should('have.attr', 'aria-checked', String(!initialState));

      // Optional: Check for a success message or other UI changes indicating the subscription status was changed
      // Example: cy.contains('You have successfully subscribed.').should('be.visible');
    });
  });
});
