import { expect, test } from '../src/fixtures/test.fixture';

test.describe('Home page', () => {
  test('loads and displays the main navigation', { tag: '@smoke' }, async ({ homePage, page }) => {
    await homePage.open();

    await expect(page).toHaveTitle(/Automation Exercise/i);
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.productsLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();
    await expect(homePage.loginLink).toBeVisible();
  });
});
