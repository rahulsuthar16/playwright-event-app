import { expect, Locator, Page } from "@playwright/test";

export type HeaderLink = "Home" | "Events" | "My Bookings" | "API Docs" | "Admin";
export type HeaderDropdownOption = "Manage Events" | "Manage Bookings";

export class HeaderComponent {
    readonly page: Page;
    readonly container: Locator;

    // Dedicated explicit locators for static elements
    readonly logo: Locator;
    readonly eventHubTitle: Locator;
    readonly userText: Locator;
    readonly adminDropdown: Locator;
    readonly dropdownOptions: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = page.locator("body nav");
        this.logo = this.container.locator(".w-8.h-8.bg-indigo-600.rounded-lg");
        this.eventHubTitle = this.container.getByText("EventHub", { exact: true });
        this.userText = this.container.getByTestId("user-email-display");
        this.logoutButton = this.container.getByTestId("logout-btn");
        this.adminDropdown = this.container.getByRole("button", { name: "Admin" });
        this.dropdownOptions = this.container.locator(`.border-gray-100.rounded-xl a`);
    }

    // ==========================================
    /**
     * Click a header link. Provides auto-suggestions via `HeaderLink`.
     * @param linkName The type-safe name of the link
     * @param openInNewTab If true, holds Ctrl/Cmd to open in a new tab
     */
    async clickLink(linkName: HeaderLink, openInNewTab: boolean = false) {
        const linkLocator = this.container.locator("a").filter({ hasText: linkName });
        await expect(linkLocator).toBeVisible();

        if (openInNewTab) {
            // Handle opening link in a new browser tab/window
            const [newTab] = await Promise.all([
                this.page.context().waitForEvent("page"),
                linkLocator.click({ modifiers: ["Control"] }), // Use ['Meta'] for macOS if needed
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
    async selectDropdownOption(optionText: HeaderDropdownOption) {
        await expect(this.adminDropdown).toBeVisible();

        // Open dropdown (hover or click depending on your UI)
        await this.adminDropdown.click();

        // Locate and click the nested option
        const optionLocator = this.dropdownOptions.filter({ hasText: optionText });
        await expect(optionLocator).toBeVisible();
        await optionLocator.click();
    }

    // ==========================================
    // Verification Helpers
    // ==========================================
    async verifyLogoAndTitle(expectedTitle: string) {
        await expect(this.logo).toBeVisible();
        await expect(this.eventHubTitle).toHaveText(expectedTitle);
    }

    async verifyUserText(expectedUsername: string) {
        await expect(this.userText).toContainText(expectedUsername);
    }

    async verifyActiveLink(linkName: HeaderLink) {
        const element = linkName === "Admin" ? "button" : "a";
        const linkLocator = this.container.locator(element).filter({ hasText: linkName });
        await expect(linkLocator).toBeVisible();
        //await expect(linkLocator).toHaveClass('text-indigo-600')
        await expect(linkLocator).toHaveClass(/text-indigo-600.*bg-indigo-50/);
    }

    async clickLogout() {
        await expect(this.logoutButton).toBeVisible();
        await this.logoutButton.click();
    }
}
