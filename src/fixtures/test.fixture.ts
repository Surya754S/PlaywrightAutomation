import { expect, test as base } from '@playwright/test';
import { ApiClient } from '../api/api-client';
import { env } from '../config/env';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductDetailsPage } from '../pages/product-details.page';
import { ProductsPage } from '../pages/products.page';

type PageObjects = {
  api: ApiClient;
  cartPage: CartPage;
  homePage: HomePage;
  loginPage: LoginPage;
  productDetailsPage: ProductDetailsPage;
  productsPage: ProductsPage;
};

export const test = base.extend<PageObjects>({
  api: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.apiUrl,
      extraHTTPHeaders: { accept: 'application/json' },
      ignoreHTTPSErrors: env.apiIgnoreHttpsErrors,
    });
    await use(new ApiClient(context));
    await context.dispose();
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
});

export { expect };
