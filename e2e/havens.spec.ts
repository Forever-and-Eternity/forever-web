import { test, expect, Page } from '@playwright/test';

const API_URL = 'http://localhost:5001';

interface AuthData {
    email: string;
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        displayName: string;
    };
}

/**
 * Register a fresh user via the API and return auth data.
 */
async function registerUser(page: Page): Promise<AuthData> {
    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
    const response = await page.request.post(`${API_URL}/auth/register`, {
        data: {
            email,
            password: 'TestPassword123!',
            displayName: 'E2E Havens User',
        },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return {
        email,
        accessToken: body.data.accessToken,
        refreshToken: body.data.refreshToken,
        user: body.data.user,
    };
}

/**
 * Inject auth tokens into localStorage so the app treats the user as logged in.
 */
async function loginViaStorage(page: Page, auth: AuthData) {
    await page.goto('/');
    await page.evaluate(
        ({ accessToken, refreshToken, user }) => {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        auth,
    );
}

test.describe('Havens Page (Authenticated)', () => {
    let auth: AuthData;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        auth = await registerUser(page);
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        await loginViaStorage(page, auth);
    });

    test('should load the havens page when authenticated', async ({ page }) => {
        await page.goto('/havens');
        await expect(page.getByRole('heading', { name: 'Your Havens' })).toBeVisible({ timeout: 10_000 });
    });

    test('should display Create Haven button', async ({ page }) => {
        await page.goto('/havens');
        await expect(page.getByRole('link', { name: 'Create Haven' }).first()).toBeVisible({ timeout: 10_000 });
    });

    test('should show empty state for new user', async ({ page }) => {
        await page.goto('/havens');

        // A fresh user has no havens, so the empty state should appear
        await expect(page.getByText('No havens yet')).toBeVisible({ timeout: 10_000 });
        await expect(page.getByText('Create your first haven to start preserving memories.')).toBeVisible();
    });

    test('should navigate to create haven page', async ({ page }) => {
        await page.goto('/havens');

        // Wait for the page to fully load
        await expect(page.getByRole('heading', { name: 'Your Havens' })).toBeVisible({ timeout: 10_000 });

        await page.getByRole('link', { name: 'Create Haven' }).first().click();
        await expect(page).toHaveURL(/\/havens\/new/);
    });

    test('should display the header with breadcrumbs', async ({ page }) => {
        await page.goto('/havens');
        await expect(page.getByRole('heading', { name: 'Your Havens' })).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('Havens Page (Unauthenticated)', () => {
    test('should redirect to login if not authenticated', async ({ page }) => {
        // Clear any existing auth
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        });

        await page.goto('/havens');

        // The main layout redirects unauthenticated users to /login
        await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    });
});
