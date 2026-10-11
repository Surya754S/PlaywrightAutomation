import { expect, test } from '../src/fixtures/test.fixture';

test.describe('Login', () => {
  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('unknown-user@example.invalid', 'invalid-password');

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });
});