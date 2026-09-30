import { expect, Locator, Page } from "@playwright/test";
import { FooterComponent } from "./components/footer.component";
import { HeaderComponent } from "./components/header.component";

export class MyBookingsPage {
    readonly page: Page
    readonly header: HeaderComponent
    readonly footer: FooterComponent
    readonly myBookingsTitle: Locator
    readonly myBookingsSubTitle: Locator
    readonly clearAllBookingsButton: Locator;
    readonly clearBookingHintText: Locator;
    // no booking found
    readonly noBookingIcon: Locator
    readonly noBookingYetText: Locator
    readonly noBookingHelpText: Locator
    readonly browseEventsButton: Locator

    constructor(page: Page) {
        this.page = page
        this.header = new HeaderComponent(page)
        this.footer = new FooterComponent(page)
        this.myBookingsTitle = page.getByRole('heading', { name: 'My Bookings' })
        this.myBookingsSubTitle = page.getByText('View and manage all your ticket bookings', { exact: true })
        this.clearAllBookingsButton = page.getByRole('button', { name: 'Clear all bookings' })
        this.clearBookingHintText = page.getByText('Do this often for clean test data.', { exact: true })
        this.noBookingIcon = page.locator("//div[@class='mb-5 text-gray-300']//*[name()='svg']")
        this.noBookingYetText = page.getByRole('heading', { name: 'No bookings yet' })
        this.noBookingHelpText = page.locator('p.text-sm.text-gray-500.max-w-sm.mb-6.leading-relaxed')
        this.browseEventsButton = page.getByRole('button', { name: 'Browse Events' })
    }

    async goto() {
        await this.page.goto("/bookings")
    }

    async verifyNoBooking() {
        await expect(this.noBookingIcon).toBeVisible()
        await expect(this.noBookingYetText).toBeVisible()
        await expect(this.noBookingHelpText).toBeVisible()
    }
}