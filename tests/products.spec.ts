import { expect, test } from '../src/fixtures/test.fixture';

test.describe('Product catalog', () => {
  test('displays the product catalog', { tag: '@smoke' }, async ({ productsPage }) => {
    await productsPage.open();

    await expect(productsPage.allProductsHeading).toBeVisible();
    await expect(productsPage.productImages.first()).toBeVisible();
  });

  test('searches for a product by name', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search('Blue Top');

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(productsPage.productNameResult('Blue Top')).toBeVisible();
  });
});