import { expect, Locator, Page } from "@playwright/test";
import { EventListComponent } from "./components/event-list.component";
import { FooterComponent } from "./components/footer.component";
import { HeaderComponent } from "./components/header.component";

export class EventsPage {
    readonly page: Page
    readonly header: HeaderComponent
    readonly footer: FooterComponent
    readonly eventList: EventListComponent;
    // hero section
    readonly upcomingEventsTitle: Locator
    readonly upcomingEventsSubTitle: Locator
    readonly searchEventsInput: Locator
    readonly categoryDropdown: Locator
    readonly cityDropdown: Locator;
    readonly clearFilter: Locator;
    readonly addNewEventButton: Locator;
    // no event found
    readonly noEventsFoundIcon: Locator
    readonly noEventsFoundText: Locator
    readonly noEventsHelpText: Locator



    constructor(page: Page) {
        this.page = page
        this.header = new HeaderComponent(page)
        this.footer = new FooterComponent(page)
        this.eventList = new EventListComponent(page)
        this.upcomingEventsTitle = page.getByRole('heading', { name: 'Upcoming Events' })
        this.upcomingEventsSubTitle = page.getByText('Find your next unforgettable experience', { exact: true })
        this.searchEventsInput = page.getByRole('textbox', { name: 'Search events, venues…' })
        this.categoryDropdown = page.getByRole('combobox').first()
        this.cityDropdown = page.getByRole('combobox').last()
        this.clearFilter = page.getByRole('button', { name: 'Clear filters' })
        this.addNewEventButton = page.getByRole('button', { name: 'Add New Event' })
        this.noEventsFoundIcon = page.locator("//div[@class='mb-5 text-gray-300']//*[name()='svg']")
        this.noEventsFoundText = page.getByRole('heading', { name: 'No events found' })
        this.noEventsHelpText = page.locator('p.text-sm.text-gray-500.max-w-sm.mb-6.leading-relaxed')
    }

    async goto() {
        await this.page.goto("/events")
    }

    async verifyNoEventsFound() {
        await expect(this.noEventsFoundIcon).toBeVisible()
        await expect(this.noEventsFoundText).toBeVisible()
        await expect(this.noEventsHelpText).toBeVisible()
    }
}