import { Page, Locator, expect } from '@playwright/test';

// Type safety for all categories of footer links
export type PopularCourse =
    | 'Selenium WebDriver with Java'
    | 'Playwright with JavaScript'
    | 'RestAssured API Testing'
    | 'Cypress End-to-End Testing'
    | 'Appium Mobile Testing';

export type EventHubLink =
    | 'Browse Events'
    | 'My Bookings'
    | 'Manage Events'
    | 'API Documentation';

export type QaHiringPlatformLink = 'techsmarthire.com →';

export type BottomLink =
    | 'rahulshettyacademy.com →'
    | 'techsmarthire.com →';

export class FooterComponent {
    readonly page: Page;
    readonly container: Locator;

    readonly academyTitle: Locator;
    readonly copyrightText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = page.locator('footer');

        this.academyTitle = this.container.locator('h3', { hasText: 'Rahul Shetty Academy' });
        this.copyrightText = this.container.locator('p', { hasText: /All rights reserved/ });
    }

    /**
     * Verify the footer structure is loaded
     */
    async verifyFooterLoaded() {
        await expect(this.container).toBeVisible();
        await expect(this.academyTitle).toBeVisible();
        await expect(this.copyrightText).toContainText('All rights reserved');
    }

    /**
     * 1. Click a Popular Course link (Handles target="_blank" new tab)
     */
    async clickPopularCourse(courseName: PopularCourse) {
        return this._clickExternalLink(
            this.container.locator('div').filter({ hasText: 'Popular Courses' }).locator('a', { hasText: courseName })
        );
    }

    /**
     * 2. Click QA Job Hiring Platform link (Inside the main grid)
     */
    async clickQaHiringPlatformLink(linkText: QaHiringPlatformLink = 'techsmarthire.com →') {
        return this._clickExternalLink(
            this.container.locator('a').filter({ hasText: 'techsmarthire.com →' }).first()
        );
    }

    /**
     * 3. Click EventHub Practice App link (Supports both internal routes and external docs)
     */
    async clickEventHubLink(linkName: EventHubLink) {
        const linkLocator = this.container.locator('div').filter({ hasText: 'EventHub Practice App' }).locator('a', { hasText: linkName });
        await expect(linkLocator).toBeVisible();

        const target = await linkLocator.getAttribute('target');
        if (target === '_blank') {
            return this._clickExternalLink(linkLocator);
        } else {
            await linkLocator.click();
        }
    }

    /**
     * 4. Click bottom row promotional links (e.g., copyright bar links)
     */
    async clickBottomLink(linkText: BottomLink) {
        // Targets the bottom flex container after the border-t line
        return this._clickExternalLink(
            this.container.locator('.border-t').locator('a', { hasText: linkText })
        );
    }

    /**
     * Private helper to handle opening links that open in a new browser tab (`target="_blank"`)
     */
    private async _clickExternalLink(locator: Locator) {
        await expect(locator).toBeVisible();
        const [newTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            locator.click()
        ]);
        await newTab.waitForLoadState();
        return newTab;
    }
}