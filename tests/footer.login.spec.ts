import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';
import { valid } from '../data/credentials.json'

test.describe('Footer scenarios', { tag: ['@footer'] }, () => {
    let dashboard: DashboardPage;

    // Navigate to the page once before each test in this block
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        loginPage.goto()
        await loginPage.login(valid.email, valid.password)
        await expect(page).toHaveURL("/")
        dashboard = new DashboardPage(page);
        await dashboard.footer.verifyFooterLoaded();
    });

    test('FOOTER_01 : should verify academy title and copyright text', async () => {
        // Already covered by beforeEach, but you can add explicit static assertions here if needed
        await expect(dashboard.footer.academyTitle).toBeVisible();
        await expect(dashboard.footer.copyrightText).toContainText('All rights reserved');
    });

    test('FOOTER_02 : should open Popular Course links in a new tab', async () => {
        const coursePage = await dashboard.footer.clickPopularCourse('Playwright with JavaScript');
        await expect(coursePage).toHaveURL(/.*rahulshettyacademy.*/);
        await coursePage.close();
    });

    test('FOOTER_03 : should navigate to EventHub internal pages', async () => {
        await dashboard.footer.clickEventHubLink('Browse Events');
        await expect(dashboard.page).toHaveURL(/.*events/);
    });

    test('FOOTER_04 : should open QA Job Hiring Platform link', async () => {
        const hiringPage = await dashboard.footer.clickQaHiringPlatformLink('techsmarthire.com →');
        await expect(hiringPage).toHaveURL(/.*techsmarthire.*/);
        await hiringPage.close();
    });

    test('FOOTER_05 : should open bottom row promotional links', async () => {
        const bottomPage = await dashboard.footer.clickBottomLink('rahulshettyacademy.com →');
        await expect(bottomPage).toHaveURL(/.*rahulshettyacademy.*/);
        await bottomPage.close();
    });
});