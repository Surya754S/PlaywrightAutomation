import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  readonly allProductsHeading: Locator;
  readonly productImages: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products', exact: true });
    this.productImages = page.getByRole('img', { name: 'ecommerce website products' });
    this.searchInput = page.getByRole('textbox', { name: 'Search Product' });
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products', exact: true });
  }

  async open(): Promise<void> {
    await this.navigate('/products');
  }

  async search(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async openFirstProduct(): Promise<void> {
    await this.page.getByRole('link', { name: /View Product$/ }).first().click();
  }

  productNameResult(productName: string): Locator {
    return this.page.getByText(productName, { exact: true }).first();
  }
}