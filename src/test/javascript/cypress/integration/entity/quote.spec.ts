import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Quote e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Quotes', () => {
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Quote').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Quote page', () => {
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('quote');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Quote page', () => {
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Quote');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Quote page', () => {
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Quote');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Quote', () => {
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Quote');

    cy.get(`[data-cy="date"]`).type('2021-05-04').should('have.value', '2021-05-04');

    cy.get(`[data-cy="open"]`).type('29088').should('have.value', '29088');

    cy.get(`[data-cy="high"]`).type('6123').should('have.value', '6123');

    cy.get(`[data-cy="low"]`).type('62702').should('have.value', '62702');

    cy.get(`[data-cy="close"]`).type('14210').should('have.value', '14210');

    cy.get(`[data-cy="adjclose"]`).type('97280').should('have.value', '97280');

    cy.get(`[data-cy="volume"]`).type('38937').should('have.value', '38937');

    cy.setFieldSelectToLastOfEntity('stock');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/quotes*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Quote', () => {
    cy.intercept('GET', '/api/quotes*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/quotes/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('quote');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('quote').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/quotes*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('quote');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
