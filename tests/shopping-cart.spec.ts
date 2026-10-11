import { expect, test } from '../src/fixtures/test.fixture';

test.describe('Shopping cart', () => {
  test('adds a product with the selected quantity', { tag: '@smoke' }, async ({
    cartPage,
    productDetailsPage,
    productsPage,
  }) => {
    await productsPage.open();
    await productsPage.openFirstProduct();

    await expect(productDetailsPage.productName).toBeVisible();
    await expect(productDetailsPage.availability).toBeVisible();
    await expect(productDetailsPage.condition).toBeVisible();
    await expect(productDetailsPage.brand).toBeVisible();

    await productDetailsPage.setQuantity(2);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.addedConfirmation).toBeVisible();
    await productDetailsPage.viewCartLink.click();

    const productRow = cartPage.productRow('Blue Top');
    await expect(productRow).toBeVisible();
    await expect(productRow.getByRole('button', { name: '2', exact: true })).toBeVisible();
    await expect(productRow).toContainText('Rs. 1000');
  });
});