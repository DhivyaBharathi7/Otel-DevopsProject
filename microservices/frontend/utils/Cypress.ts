import { CypressFields } from './enums/CypressFields';
export { CypressFields } from './enums/CypressFields';

/**
 * Returns a Cypress chainable for an element with the given data-cy field.
 * @param field - The CypressFields enum value to select.
 * @param context - Optional Cypress chainable context (defaults to cy).
 */
export const getElementByField = (
  field: CypressFields,
  context: Cypress.Chainable = cy
) => context.get(`[data-cy="${field}"]`);