/* eslint-disable no-undef */

describe('Register Page Tests', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display registration form with all elements', () => {
    // Check main heading
    cy.get('h1').contains('Buat Akun Baru').should('be.visible');
    cy.get('p').contains('Bergabunglah dengan komunitas Forum Discussion').should('be.visible');
    
    // Check all form fields are visible
    cy.get('input[name="fullName"]').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
    cy.get('input[name="agreedToTerms"]').should('be.visible');
    
    // Check form labels
    cy.contains('label', 'Nama Lengkap').should('be.visible');
    cy.contains('label', 'Username').should('be.visible');
    cy.contains('label', 'Email').should('be.visible');
    cy.contains('label', 'Password').should('be.visible');
    cy.contains('label', 'Konfirmasi Password').should('be.visible');
    
    // Check submit button
    cy.get('button[type="submit"]').contains('Buat Akun').should('be.visible');
    
    // Check login link
    cy.contains('Sudah punya akun?').should('be.visible');
    cy.contains('button', 'Masuk di sini').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    
    // Wait a bit for validation to trigger
    cy.wait(500);
    
    // Check all required field validation errors
    cy.get('.invalid-feedback').should('contain', 'Nama lengkap wajib diisi');
    cy.get('.invalid-feedback').should('contain', 'Username wajib diisi');
    cy.get('.invalid-feedback').should('contain', 'Email wajib diisi');
    cy.get('.invalid-feedback').should('contain', 'Password wajib diisi');
    cy.get('.invalid-feedback').should('contain', 'Konfirmasi password wajib diisi');
    cy.get('.invalid-feedback').should('contain', 'Anda harus menyetujui syarat dan ketentuan');
  });

  it('should validate full name requirements', () => {
    // Test empty full name
    cy.get('input[name="fullName"]').focus().blur();
    cy.get('button[type="submit"]').click();
    cy.contains('Nama lengkap wajib diisi').should('be.visible');
    
    // Test minimum length
    cy.get('input[name="fullName"]').clear().type('A');
    cy.get('button[type="submit"]').click();
    cy.contains('Nama lengkap minimal 2 karakter').should('be.visible');
  });

  it('should validate username requirements', () => {
    // Test empty username
    cy.get('button[type="submit"]').click();
    cy.contains('Username wajib diisi').should('be.visible');
    
    // Test minimum length
    cy.get('input[name="username"]').type('ab');
    cy.get('button[type="submit"]').click();
    cy.contains('Username minimal 3 karakter').should('be.visible');
    
    // Test invalid characters
    cy.get('input[name="username"]').clear().type('test user!');
    cy.get('button[type="submit"]').click();
    cy.contains('Username hanya boleh mengandung huruf, angka, dan underscore').should('be.visible');
    
    // Test valid username with underscore
    cy.get('input[name="username"]').clear().type('test_user123');
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('input[name="confirmPassword"]').type('TestPassword123');
    cy.get('input[name="agreedToTerms"]').check();
    cy.get('button[type="submit"]').click();
    cy.contains('Username hanya boleh mengandung huruf, angka, dan underscore').should('not.exist');
  });

  it('should validate email format', () => {
    // Test invalid email format
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.contains('Format email tidak valid').should('be.visible');
    
    // Test another invalid format
    cy.get('input[name="email"]').clear().type('test@');
    cy.get('button[type="submit"]').click();
    cy.contains('Format email tidak valid').should('be.visible');
    
    // Test valid email
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="username"]').type('testuser123');
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('input[name="confirmPassword"]').type('TestPassword123');
    cy.get('input[name="agreedToTerms"]').check();
    cy.get('button[type="submit"]').click();
    cy.contains('Format email tidak valid').should('not.exist');
  });

  it('should validate password requirements', () => {
    // Fill other required fields first to focus on password validation
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="username"]').type('testuser123');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="agreedToTerms"]').check();
    // Test minimum length
    cy.get('input[name="password"]').type('weak');
    cy.get('input[name="confirmPassword"]').type('weak');
    cy.get('button[type="submit"]').click();
    cy.get('.invalid-feedback').should('contain', 'Password minimal 6 karakter');
    
    // Test password complexity (missing uppercase, lowercase, or number)
    cy.get('input[name="password"]').clear().type('weakpassword');
    cy.get('input[name="confirmPassword"]').clear().type('weakpassword');
    cy.get('button[type="submit"]').click();
    cy.get('.invalid-feedback').should('contain', 'Password harus mengandung huruf besar, kecil, dan angka');
    
    cy.get('input[name="password"]').clear().type('WEAKPASSWORD123');
    cy.get('input[name="confirmPassword"]').clear().type('WEAKPASSWORD123');
    cy.get('button[type="submit"]').click();
    cy.get('.invalid-feedback').should('contain', 'Password harus mengandung huruf besar, kecil, dan angka');
    
    cy.get('input[name="password"]').clear().type('WeakPassword');
    cy.get('input[name="confirmPassword"]').clear().type('WeakPassword');
    cy.get('button[type="submit"]').click();
    cy.get('.invalid-feedback').should('contain', 'Password harus mengandung huruf besar, kecil, dan angka');
  });

  it('should validate password confirmation', () => {
    // Fill other required fields first
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="username"]').type('testuser123');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="agreedToTerms"]').check();
    
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('input[name="confirmPassword"]').type('DifferentPassword123');
    cy.get('button[type="submit"]').click();
    cy.get('.invalid-feedback').should('contain', 'Password tidak cocok');
  });

  it('should toggle password visibility', () => {
    // Test password field toggle
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.get('input[name="password"]').siblings('button').contains('👁️').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.get('input[name="password"]').siblings('button').contains('🙈').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    
    // Test confirm password field toggle
    cy.get('input[name="confirmPassword"]').should('have.attr', 'type', 'password');
    cy.get('input[name="confirmPassword"]').siblings('button').contains('👁️').click();
    cy.get('input[name="confirmPassword"]').should('have.attr', 'type', 'text');
    cy.get('input[name="confirmPassword"]').siblings('button').contains('🙈').click();
    cy.get('input[name="confirmPassword"]').should('have.attr', 'type', 'password');
  });

  it('should clear field errors when user starts typing', () => {
    // Trigger validation errors first
    cy.get('button[type="submit"]').click();
    cy.contains('Username wajib diisi').should('be.visible');
    
    // Start typing and check error disappears
    cy.get('input[name="username"]').type('test');
    cy.contains('Username wajib diisi').should('not.exist');
  });

  it('should show terms and conditions links', () => {
    cy.contains('Syarat dan Ketentuan').should('be.visible');
    cy.contains('Kebijakan Privasi').should('be.visible');
  });

  it('should show loading state during submission', () => {
    // Fill form with valid data
    const timestamp = Date.now();
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="username"]').type(`testuser${timestamp}`);
    cy.get('input[name="email"]').type(`test${timestamp}@example.com`);
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('input[name="confirmPassword"]').type('TestPassword123');
    cy.get('input[name="agreedToTerms"]').check();
    
    // Intercept the registration API call to simulate loading
    cy.intercept('POST', '**/register', { delay: 2000, body: { success: true } }).as('registerUser');
    
    cy.get('button[type="submit"]').click();
    
    // Check loading state
    cy.contains('Membuat Akun...').should('be.visible');
    cy.get('.spinner-border').should('be.visible');
    cy.contains('Sedang memproses registrasi...').should('be.visible');
    
    // Form fields should be disabled during loading
    cy.get('input[name="fullName"]').should('be.disabled');
    cy.get('input[name="username"]').should('be.disabled');
    cy.get('input[name="email"]').should('be.disabled');
    cy.get('input[name="password"]').should('be.disabled');
    cy.get('input[name="confirmPassword"]').should('be.disabled');
    cy.get('input[name="agreedToTerms"]').should('be.disabled');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should navigate to login page when clicking login link', () => {
    cy.get('button').contains('Masuk di sini').click();
    // This would typically check for navigation, but since it's just console.log in the component
    // you might want to mock the navigation function or check for the actual navigation
  });

  it('should show help text for username and password fields', () => {
    cy.contains('Username akan digunakan untuk identifikasi di forum').should('be.visible');
    cy.contains('Minimal 6 karakter, harus mengandung huruf besar, kecil, dan angka').should('be.visible');
  });

  it('should display copyright notice', () => {
    cy.contains('© 2025 Forum Discussion. Semua hak dilindungi.').should('be.visible');
  });

  it('should have proper accessibility attributes', () => {
    // Check ARIA labels for password toggle buttons
    cy.get('input[name="password"]').siblings('button').should('have.attr', 'aria-label');
    cy.get('input[name="confirmPassword"]').siblings('button').should('have.attr', 'aria-label');
    // Check form validation attributes
    cy.get('input[name="fullName"]').should('have.attr', 'required');
    cy.get('input[name="username"]').should('have.attr', 'required');
    cy.get('input[name="email"]').should('have.attr', 'required');
    cy.get('input[name="password"]').should('have.attr', 'required');
    cy.get('input[name="confirmPassword"]').should('have.attr', 'required');
    cy.get('input[name="agreedToTerms"]').should('have.attr', 'required');
  });
});