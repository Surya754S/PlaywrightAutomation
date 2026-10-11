import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly brand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addedConfirmation: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.getByRole('heading', { name: 'Blue Top', exact: true });
    this.availability = page.getByText('Availability: In Stock', { exact: true });
    this.condition = page.getByText('Condition: New', { exact: true });
    this.brand = page.getByText('Brand: Polo', { exact: true });
    this.quantityInput = page.getByRole('spinbutton');
    this.addToCartButton = page.getByRole('button', { name: /Add to cart$/ });
    this.addedConfirmation = page.getByRole('heading', { name: 'Added!', exact: true });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart', exact: true });
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}