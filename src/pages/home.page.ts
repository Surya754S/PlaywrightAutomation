import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink = page.getByRole('link', { name: /Home$/ });
    this.productsLink = page.getByRole('link', { name: /Products$/ });
    this.cartLink = page.getByRole('link', { name: /Cart$/ });
    this.loginLink = page.getByRole('link', { name: /Signup \/ Login$/ });
  }

  async open(): Promise<void> {
    await this.navigate('/');
  }
}
