describe('End-to-End User Flow Verification', () => {
  it('should load the application and display the homepage', () => {
    cy.visit('/');
    cy.contains('Welcome to the App').should('be.visible');
  });

  it('should allow users to log in', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Dashboard').should('be.visible');
  });

  it('should allow users to navigate to the settings page', () => {
    cy.visit('/dashboard');
    cy.get('a[href="/settings"]').click();
    cy.contains('Settings').should('be.visible');
  });

  it('should allow users to update their profile', () => {
    cy.visit('/settings');
    cy.get('input[name="name"]').clear().type('New Name');
    cy.get('button[type="submit"]').click();
    cy.contains('Profile updated successfully').should('be.visible');
  });
});
