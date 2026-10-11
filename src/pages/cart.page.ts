import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('/view_cart');
  }

  productRow(productName: string): Locator {
    return this.page.getByRole('row').filter({ hasText: productName });
  }
}