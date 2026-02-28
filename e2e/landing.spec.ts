import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the landing page', async ({ page }) => {
        await expect(page).toHaveTitle(/Forever/);
    });

    test('should display the hero section with headline', async ({ page }) => {
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Preserve What Matters');
        await expect(heading).toContainText('Forever');
    });

    test('should display the hero description', async ({ page }) => {
        await expect(
            page.getByText('A private space to gather photos, stories, and memories for the people you love'),
        ).toBeVisible();
    });

    test('should have Get Started and Sign In buttons', async ({ page }) => {
        const getStarted = page.getByRole('link', { name: 'Get Started' });
        const signIn = page.getByRole('link', { name: 'Sign In' });

        await expect(getStarted).toBeVisible();
        await expect(signIn).toBeVisible();
    });

    test('should navigate to register page when clicking Get Started', async ({ page }) => {
        await page.getByRole('link', { name: 'Get Started' }).click();
        await expect(page).toHaveURL(/\/register/);
    });

    test('should navigate to login page when clicking Sign In', async ({ page }) => {
        await page.getByRole('link', { name: 'Sign In' }).click();
        await expect(page).toHaveURL(/\/login/);
    });

    test('should display the features section', async ({ page }) => {
        await expect(page.getByText('Everything you need to preserve memories')).toBeVisible();
    });

    test('should display all four feature cards', async ({ page }) => {
        await expect(page.getByText('Private Havens')).toBeVisible();
        await expect(page.getByText('Rich Annotations')).toBeVisible();
        await expect(page.getByText('Tag & Connect')).toBeVisible();
        await expect(page.getByText('Secure Sharing')).toBeVisible();
    });
});
