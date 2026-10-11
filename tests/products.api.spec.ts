import { expect, test } from '../src/fixtures/test.fixture';
import type { BrandsResponse, ProductsResponse } from '../src/api/api.types';

test.describe('Automation Exercise products API', () => {
  test('returns a non-empty product catalog', { tag: '@smoke' }, async ({ api }) => {
    const response = await api.get('/api/productsList');
    expect(response.status()).toBe(200);

    const body = (await response.json()) as ProductsResponse;
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0]).toMatchObject({
      id: 1,
      name: 'Blue Top',
      brand: 'Polo',
    });
  });

  test('returns a non-empty brand list', async ({ api }) => {
    const response = await api.get('/api/brandsList');
    expect(response.status()).toBe(200);

    const body = (await response.json()) as BrandsResponse;
    expect(body.responseCode).toBe(200);
    expect(body.brands.length).toBeGreaterThan(0);
    expect(body.brands[0]).toMatchObject({ id: 1, brand: 'Polo' });
  });

  for (const { searchTerm, expectedProduct } of [
    { searchTerm: 'top', expectedProduct: 'Blue Top' },
    { searchTerm: 'dress', expectedProduct: 'Sleeveless Dress' },
  ]) {
    test(`searches products for "${searchTerm}"`, async ({ api }) => {
      const response = await api.postForm('/api/searchProduct', {
        search_product: searchTerm,
      });
      expect(response.status()).toBe(200);

      const body = (await response.json()) as ProductsResponse;
      expect(body.responseCode).toBe(200);
      expect(body.products.length).toBeGreaterThan(0);
      expect(body.products.map((product) => product.name)).toContain(expectedProduct);
    });
  }
});