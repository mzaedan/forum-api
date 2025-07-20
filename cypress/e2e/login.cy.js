/* global cy, describe, it, Cypress */
// Cypress is available in the test context
describe('Login Flow', () => {
  it('should log in successfully and redirect to home', () => {
    // Visit the login page
    cy.visit('/login');

    // Fill email
    cy.get('input[name="email"]').type('zaedan@gmail.com');

    // Fill password
    cy.get('input[name="password"]').type('Zaedan123');

    // Submit form and wait for navigation
    cy.get('button[type="submit"]').click();

    // Wait for navigation and check home page
    // Increased timeout to account for the 500ms delay in the login handler
    const baseUrl = Cypress.config().baseUrl || 'http://localhost:5173';
    cy.url({ timeout: 2000 }).should('eq', `${baseUrl}/`);

    // Optionally, check for a success message or main homepage element
    cy.contains('Forum Discussion').should('exist');
  });

  it('should show error on wrong password', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('zaedan@gmail.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    // Cek error message apapun yang muncul setelah login gagal
    cy.get('.error, [role="alert"], .alert, .MuiAlert-message').should('exist');
  });
});