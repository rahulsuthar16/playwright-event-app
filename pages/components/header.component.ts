import { expect, Locator, Page } from "@playwright/test";

export type HeaderLink = 'Home' | 'Events' | 'My Bookings' | 'API Docs';
export type HeaderDropdown = 'Account';

export class HeaderComponent {
    readonly page: Page
    readonly container: Locator;

    // Dedicated explicit locators for static elements
    readonly logo: Locator;
    readonly title: Locator;
    readonly userText: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page
        this.container = page.locator('body nav')
        this.logo = this.container.locator('.w-8.h-8.bg-indigo-600.rounded-lg')
        this.title = this.container.getByText('EventHub', { exact: true })
        this.userText = this.container.getByTestId('user-email-display')
        this.logoutButton = this.container.getByTestId('logout-btn')
    }

    // ==========================================
    /**
     * Click a header link. Provides auto-suggestions via `HeaderLink`.
     * @param linkName The type-safe name of the link
     * @param openInNewTab If true, holds Ctrl/Cmd to open in a new tab
     */
    async clickLink(linkName: HeaderLink, openInNewTab: boolean = false) {
        const linkLocator = this.container.locator('a').filter({ hasText: linkName });
        await expect(linkLocator).toBeVisible();

        if (openInNewTab) {
            // Handle opening link in a new browser tab/window
            const [newTab] = await Promise.all([
                this.page.context().waitForEvent('page'),
                linkLocator.click({ modifiers: ['Control'] }) // Use ['Meta'] for macOS if needed
            ]);
            await newTab.waitForLoadState();
            return newTab; // Returns the new page object if you need to test inside it
        } else {
            await linkLocator.click();
        }
    }

    // ==========================================
    // 3. Dropdown Handling
    // ==========================================
    /**
     * Interact with dropdown menus in the header with type-safe options
     */
    async selectDropdownOption(dropdownName: HeaderDropdown, optionText: string) {
        const dropdownTrigger = this.container.locator('button, [role="button"]').filter({ hasText: dropdownName });
        await expect(dropdownTrigger).toBeVisible();

        // Open dropdown (hover or click depending on your UI)
        await dropdownTrigger.click();

        // Locate and click the nested option
        const optionLocator = this.page.locator(`[role="menuitem"], .dropdown-menu`).filter({ hasText: optionText });
        await expect(optionLocator).toBeVisible();
        await optionLocator.click();
    }

    // ==========================================
    // Verification Helpers
    // ==========================================
    async verifyLogoAndTitle(expectedTitle: string) {
        await expect(this.logo).toBeVisible();
        await expect(this.title).toHaveText(expectedTitle);
    }

    async verifyUserText(expectedUsername: string) {
        await expect(this.userText).toContainText(expectedUsername);
    }

    async clickLogout() {
        await expect(this.logoutButton).toBeVisible();
        await this.logoutButton.click();
    }
}