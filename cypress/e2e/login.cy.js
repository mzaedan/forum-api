/* eslint-disable no-undef */
// Configure Cypress for this test file
describe('Login Flow', { defaultCommandTimeout: 10000 }, () => {
  // Clear cookies and local storage before all tests
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should log in successfully and redirect to home', () => {
    // Visit the login page with retry
    cy.visit('/login', { retryOnNetworkFailure: true });

    // Ensure the login form is visible
    cy.get('form').should('be.visible');

    // Fill email with retry
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('zaedan@gmail.com', { delay: 100 });

    // Fill password with retry
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('Zaedan123', { delay: 100 });

    // Submit form and wait for navigation
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    // Wait for navigation with increased timeout and retry
    const baseUrl = 'http://localhost:5173';

    // First ensure we're not on the login page anymore
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    // Then check if we're on the home page
    cy.url({ timeout: 5000 }).should('eq', `${baseUrl}/`);

    // Verify successful login by checking for elements that should be present
    cy.get('body').then(($body) => {
      // Check for either forum discussion text or any element that indicates successful login
      if ($body.text().includes('Forum Discussion')) {
        cy.contains('Forum Discussion').should('be.visible');
      } else {
        // If the exact text isn't found, check for any element that indicates we're logged in
        cy.get('nav, header, .app-container, .home-page').should('be.visible');
      }
    });
  })

  it('should show error on wrong password', () => {
    // Kunjungi halaman login
    cy.visit('/login');

    // Pastikan form login terlihat
    cy.get('form').should('be.visible');

    // Isi form dengan password yang salah
    cy.get('input[name="email"]').type('zaedan@gmail.com');
    cy.get('input[name="password"]').type('wrongpassword');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Tunggu dan periksa apakah ada pesan error
    // Coba beberapa selector yang mungkin digunakan untuk menampilkan error
    const errorSelectors = [
      '[data-testid="error-message"]',
      '.error-message',
      '.text-red-500',
      '.text-danger',
      '[role="alert"]',
      '.alert',
      '.MuiAlert-message',
      '.toast-error',
      '.notification-error',
      '.error',
      '.text-error'
    ].join(',');

    // Debug: Ambil screenshot jika test gagal
    cy.get('body').screenshot('login-error-page', { capture: 'runner' });

    // Cari elemen error dengan selector yang mungkin
    cy.get(errorSelectors, { timeout: 10000 })
      .should('be.visible')
      .then(($el) => {
        // Jika elemen ditemukan, cek teksnya
        const errorText = $el.text().toLowerCase();
        const expectedErrors = [
          'salah', 'gagal', 'error', 'invalid',
          'password', 'kredensial', 'login', 'akun',
          'incorrect', 'wrong', 'tidak valid', 'gagal masuk'
        ];

        // Log untuk debugging
        cy.log('Error message found:', errorText);

        // Cek apakah teks error mengandung salah satu kata kunci yang diharapkan
        const hasError = expectedErrors.some((msg) => errorText.includes(msg));
        
        // Jika tidak ada error yang sesuai, tampilkan pesan yang lebih informatif
        if (!hasError) {
          cy.log('Actual error message:', errorText);
          cy.log('Expected to find one of:', expectedErrors);
        }
        
        expect(hasError, 'Expected to find an error message about invalid login').to.be.true;
      });
  });
});