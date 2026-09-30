// components/create-event.component.ts
import { Page, Locator, expect } from "@playwright/test";

export class CreateEventFormComponent {
    readonly page: Page;
    readonly form: Locator;

    // Inputs
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly categorySelect: Locator;
    readonly cityInput: Locator;
    readonly venueInput: Locator;
    readonly dateTimeInput: Locator;
    readonly priceInput: Locator;
    readonly totalSeatsInput: Locator;
    readonly imageUrlInput: Locator;
    readonly submitButton: Locator;
    readonly updateEventButton: Locator;
    readonly cancelEditButton: Locator;

    // Error Message Locators (using adjacent sibling selectors)
    readonly titleError: Locator;
    readonly cityError: Locator;
    readonly venueError: Locator;
    readonly dateTimeError: Locator;
    readonly priceError: Locator;
    readonly totalSeatsError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator("#admin-event-form");

        // Input Locators
        this.titleInput = page.locator("#event-title-input");
        this.descriptionInput = page.locator("textarea");
        this.categorySelect = page.locator("#category");
        this.cityInput = page.locator("#city");
        this.venueInput = page.locator("#venue");
        this.dateTimeInput = page.locator("input[type='datetime-local']");
        this.priceInput = page.locator("#price-\\(\\$\\)");
        this.totalSeatsInput = page.locator("#total-seats");
        this.imageUrlInput = page.locator("input[type='url']");
        this.submitButton = page.locator("#add-event-btn");
        this.updateEventButton = page.locator('button:has-text("Update Event")');
        this.cancelEditButton = page.getByRole("button", { name: "Cancel edit" });

        // Error Message Locators (Targets the <p> tag immediately following each required input when error state triggers)
        this.titleError = page.locator("#event-title-input + p.text-xs.text-red-600");
        this.cityError = page.locator("#city + p.text-xs.text-red-600");
        this.venueError = page.locator("#venue + p.text-xs.text-red-600");
        this.dateTimeError = page.locator("input[type='datetime-local'] + p.text-xs.text-red-600");
        this.priceError = page.locator("#price-\\(\\%24\\) + p.text-xs.text-red-600, #price-\\(\\$\\) + p.text-xs.text-red-600");
        this.totalSeatsError = page.locator("#total-seats + p.text-xs.text-red-600");
    }

    async fillEventForm(data: { title: string; description?: string; category: string; city: string; venue: string; dateTime: string; price: string; totalSeats: string; imageUrl?: string }) {
        await this.titleInput.fill(data.title);
        if (data.description) await this.descriptionInput.fill(data.description);
        await this.categorySelect.selectOption(data.category);
        await this.cityInput.fill(data.city);
        await this.venueInput.fill(data.venue);
        await this.dateTimeInput.fill(data.dateTime);
        await this.priceInput.fill(data.price);
        await this.totalSeatsInput.fill(data.totalSeats);
        if (data.imageUrl) await this.imageUrlInput.fill(data.imageUrl);
    }

    /**
     * Verifies that the form input fields contain the expected values (useful for Edit flows)
     */
    async verifyFormValues(expectedData: {
        title?: string;
        description?: string;
        category?: string;
        city?: string;
        venue?: string;
        dateTime?: string;
        price?: string;
        totalSeats?: string;
        imageUrl?: string;
    }) {
        if (expectedData.title !== undefined) {
            await expect(this.titleInput).toHaveValue(expectedData.title);
        }
        if (expectedData.description !== undefined) {
            await expect(this.descriptionInput).toHaveValue(expectedData.description);
        }
        if (expectedData.category !== undefined) {
            await expect(this.categorySelect).toHaveValue(expectedData.category);
        }
        if (expectedData.city !== undefined) {
            await expect(this.cityInput).toHaveValue(expectedData.city);
        }
        if (expectedData.venue !== undefined) {
            await expect(this.venueInput).toHaveValue(expectedData.venue);
        }
        if (expectedData.dateTime !== undefined) {
            await expect(this.dateTimeInput).toHaveValue(expectedData.dateTime);
        }
        if (expectedData.price !== undefined) {
            await expect(this.priceInput).toHaveValue(expectedData.price);
        }
        if (expectedData.totalSeats !== undefined) {
            await expect(this.totalSeatsInput).toHaveValue(expectedData.totalSeats);
        }
        if (expectedData.imageUrl !== undefined) {
            await expect(this.imageUrlInput).toHaveValue(expectedData.imageUrl);
        }
    }

    async submitForm() {
        await this.submitButton.click();
    }

    /**
     * Verifies that all mandatory error messages are displayed when submitting an empty form
     */
    async verifyAllRequiredFieldErrors() {
        await expect(this.titleError).toHaveText("Title is required");
        await expect(this.cityError).toHaveText("City is required");
        await expect(this.venueError).toHaveText("Venue is required");
        await expect(this.dateTimeError).toHaveText("Event date is required");
        await expect(this.priceError).toHaveText("Enter a valid price (≥ 0)");
        await expect(this.totalSeatsError).toHaveText("Must have at least 1 seat");
    }
}
