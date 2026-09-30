import { expect, Locator } from "@playwright/test";


export class EventCardComponent {
    readonly cardContainer: Locator

    readonly eventTypeChip: Locator;
    readonly featuredChip: Locator;
    readonly eventImage: Locator;
    readonly eventTitle: Locator
    readonly eventDate: Locator
    readonly eventLocation: Locator
    readonly eventPrice: Locator
    readonly eventSeats: Locator
    readonly bookNowButton: Locator

    constructor(baseLocator: Locator) {
        this.cardContainer = baseLocator
        this.eventTypeChip = this.cardContainer.locator("span.rounded-full").first()
        this.featuredChip = this.cardContainer.locator("span.rounded-full").last()
        this.eventImage = this.cardContainer.locator("img")
        this.eventTitle = this.cardContainer.locator("h3")
        this.eventDate = this.cardContainer.locator(".text-gray-500").first()
        this.eventLocation = this.cardContainer.locator(".text-gray-500").last()
        this.eventPrice = this.cardContainer.locator("p")
        this.eventSeats = this.cardContainer.locator(".text-emerald-600")
        this.bookNowButton = this.cardContainer.getByTestId("book-now-btn")
    }

    async verifyCard() {
        // event image title and tag
        await expect(this.eventTypeChip).toBeVisible()
        await expect(this.featuredChip).toBeVisible()
        await expect(this.eventImage).toBeVisible()
        await expect(this.eventTitle).toBeVisible()

        // event date and location
        await expect(this.eventImage).toBeVisible()
        await expect(this.eventDate).toBeVisible()
        await expect(this.eventLocation).toBeVisible()

        // event price, seats and book now
        await expect(this.eventPrice).toBeVisible()
        await expect(this.eventSeats).toBeVisible()
        await expect(this.bookNowButton).toBeVisible()
    }

    async getTitle() {
        return (await this.eventTitle.textContent()) || "";
    }

    async getEventType() {
        return (await this.eventTypeChip.textContent()) || "";
    }

    async getLocation() {
        return (await this.eventLocation.textContent()) || "";
    }


}