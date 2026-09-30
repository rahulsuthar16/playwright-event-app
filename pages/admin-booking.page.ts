import { expect, Locator, Page } from "@playwright/test";
import { FooterComponent } from "./components/footer.component";
import { HeaderComponent } from "./components/header.component";

export class AdminBookingsPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    readonly manageBookingsTitle: Locator;
    readonly manageBookingsSubTitle: Locator;
    readonly bookingStatusDropdown: Locator;
    // no booking found
    readonly noBookingsFoundIcon: Locator;
    readonly noBookingsFoundText: Locator;
    readonly noBookingsFoundHelpText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.manageBookingsTitle = page.getByRole("heading", { name: "Manage Bookings" });
        this.manageBookingsSubTitle = page.locator('p:has-text(" total bookings")');
        this.bookingStatusDropdown = page.getByRole("combobox");
        this.noBookingsFoundIcon = page.locator("//div[@class='mb-5 text-gray-300']//*[name()='svg']");
        this.noBookingsFoundText = page.getByRole("heading", { name: "No bookings found" });
        this.noBookingsFoundHelpText = page.getByText("There are no bookings matching your filters.", { exact: true });
    }

    async goto() {
        await this.page.goto("/admin/bookings");
    }

    async verifyNoBooking() {
        await expect(this.noBookingsFoundIcon).toBeVisible();
        await expect(this.noBookingsFoundText).toBeVisible();
        await expect(this.noBookingsFoundHelpText).toBeVisible();
    }
}
