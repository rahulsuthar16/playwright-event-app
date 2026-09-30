// event-list-section.component.ts
import { Page, Locator, expect } from "@playwright/test";
import { EventCardComponent } from "./event-card.component";

export class EventListComponent {
    readonly cardsLocator: Locator;

    constructor(page: Page) {
        this.cardsLocator = page.getByTestId("event-card");
    }

    // Private helper method - only accessible inside this class
    private async getCount(): Promise<number> {
        return await this.cardsLocator.count();
    }

    // Public method - can be called directly from your tests
    async verifyCardCount(expectedCount: number) {
        const count = await this.getCount();
        expect(count).toBe(expectedCount);
    }

    getCard(index: number) {
        return new EventCardComponent(this.cardsLocator.nth(index));
    }

    async verifyAllCards() {
        const count = await this.getCount();
        for (let i = 0; i < count; i++) {
            const card = this.getCard(i);
            await card.verifyCard();
        }
    }

    // Function to verify that all cards match a search criteria across specific fields
    async verifyAllCardsMatchSearch(searchTerm: string, searchBy: "title" | "type" | "location") {
        const count = await this.getCount();
        expect(count).toBeGreaterThan(0);

        const lowerCaseSearch = searchTerm.toLowerCase();

        for (let i = 0; i < count; i++) {
            const card = this.getCard(i);
            let fieldValue = "";

            switch (searchBy) {
                case "title":
                    fieldValue = await card.getTitle();
                    break;
                case "type":
                    fieldValue = await card.getEventType();
                    break;
                case "location":
                    fieldValue = await card.getLocation();
                    break;
            }

            // Assert that the card's field includes the search term (case-insensitive)
            expect(fieldValue.toLowerCase()).toContain(lowerCaseSearch);
        }
    }
}
