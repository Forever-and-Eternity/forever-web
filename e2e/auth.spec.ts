import { test, expect, Page } from '@playwright/test';

const API_URL = 'http://localhost:5001';

/**
 * Generate a unique email for each test run to avoid conflicts.
 */
function uniqueEmail(): string {
    return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
}

/**
 * Clear auth state from localStorage so each test starts logged out.
 */
async function clearAuth(page: Page) {
    await page.evaluate(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    });
}

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should render the login form', async ({ page }) => {
        await expect(page.getByText('Welcome back')).toBeVisible();
        await expect(page.getByText('Sign in to your Forever account')).toBeVisible();
    });

    test('should have email and password fields', async ({ page }) => {
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
    });

    test('should have a sign in button', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should have a link to the register page', async ({ page }) => {
        const registerLink = page.getByRole('link', { name: 'Create one' });
        await expect(registerLink).toBeVisible();
        await registerLink.click();
        await expect(page).toHaveURL(/\/register/);
    });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.getByLabel('Email').fill('nonexistent@example.com');
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Wait for the error message to appear (from API or form validation)
        const errorMessage = page.locator('.bg-destructive\\/10');
        await expect(errorMessage).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('Register Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('should render the register form', async ({ page }) => {
        await expect(page.getByText('Create your account')).toBeVisible();
        await expect(page.getByText('Start preserving memories forever')).toBeVisible();
    });

    test('should have display name, email, and password fields', async ({ page }) => {
        await expect(page.getByLabel('Display name')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
    });

    test('should have a create account button', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    });

    test('should have a link to the login page', async ({ page }) => {
        const loginLink = page.getByRole('link', { name: 'Sign in' });
        await expect(loginLink).toBeVisible();
        await loginLink.click();
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe('Registration and Login Flow', () => {
    const testEmail = uniqueEmail();
    const testPassword = 'TestPassword123!';
    const testDisplayName = 'E2E Test User';

    test('should register a new account and redirect to havens', async ({ page }) => {
        await page.goto('/register');

        await page.getByLabel('Display name').fill(testDisplayName);
        await page.getByLabel('Email').fill(testEmail);
        await page.getByLabel('Password').fill(testPassword);
        await page.getByRole('button', { name: 'Create account' }).click();

        // After successful registration, the app should redirect to /havens
        await expect(page).toHaveURL(/\/havens/, { timeout: 15_000 });

        // Verify auth tokens were stored in localStorage
        const hasToken = await page.evaluate(() => !!localStorage.getItem('accessToken'));
        expect(hasToken).toBe(true);

        const hasUser = await page.evaluate(() => !!localStorage.getItem('user'));
        expect(hasUser).toBe(true);
    });

    test('should login with the registered account and redirect to havens', async ({ page }) => {
        // First register via API so we have a known account
        const email = uniqueEmail();
        const registerResponse = await page.request.post(`${API_URL}/auth/register`, {
            data: {
                email,
                password: testPassword,
                displayName: testDisplayName,
            },
        });
        expect(registerResponse.ok()).toBeTruthy();

        // Now test the login UI flow
        await page.goto('/login');
        await clearAuth(page);

        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Password').fill(testPassword);
        await page.getByRole('button', { name: 'Sign in' }).click();

        // After successful login, the app should redirect to /havens
        await expect(page).toHaveURL(/\/havens/, { timeout: 15_000 });

        // Verify auth tokens were stored in localStorage
        const storedUser = await page.evaluate(() => {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        });
        expect(storedUser).toBeTruthy();
        expect(storedUser.email).toBe(email);
        expect(storedUser.displayName).toBe(testDisplayName);

        const hasAccessToken = await page.evaluate(() => !!localStorage.getItem('accessToken'));
        expect(hasAccessToken).toBe(true);

        const hasRefreshToken = await page.evaluate(() => !!localStorage.getItem('refreshToken'));
        expect(hasRefreshToken).toBe(true);
    });
});
