describe('clip', () => {
  it('should play clip', () => {
    cy.visit('/');
    cy.get('app-clips-list > .grid a:first').click();
    cy.get('.video-js').click();
    cy.wait(6000);
    cy.get('.video-js').click();
    cy.get('.vjs-play-progress').invoke('width').should('gte', 0); //'gte' means "greater than or equals to", this as well as the should() function are from the Chai library that Cypress also uses.
  })
})
