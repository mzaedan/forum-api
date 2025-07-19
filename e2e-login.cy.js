/* eslint-disable no-undef */
// Pengujian End-to-End: Login
// Skenario:
// 1. User mengisi email dan password
// 2. Klik tombol login
// 3. Jika sukses, diarahkan ke halaman utama

describe('Login Flow', () => {
  it('should login successfully and redirect to home', () => {
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').type('user@dicoding.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button').contains(/login/i).click();
    cy.url().should('not.include', '/login');
    cy.contains(/login berhasil/i, { matchCase: false });
  });
});
