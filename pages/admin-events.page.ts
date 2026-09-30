import { Locator, Page } from "@playwright/test";
import { CreateEventFormComponent } from "./components/create-event-form.component";
import { EventTableComponent } from "./components/event-table.component";
import { FooterComponent } from "./components/footer.component";
import { HeaderComponent } from "./components/header.component";

export class AdminEventsPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    readonly formTitle: Locator;
    readonly formInfoAlert: Locator;
    readonly createEventForm: CreateEventFormComponent;
    readonly eventTable: EventTableComponent;
    readonly allEventsTableTitle: Locator;
    readonly allEventsTableRowCount: Locator;
    readonly eventCreatedAlert: Locator;
    readonly eventDeletedAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.createEventForm = new CreateEventFormComponent(page);
        this.eventTable = new EventTableComponent(page);
        this.formTitle = page.getByRole("heading", { name: "+ New Event" });
        this.formInfoAlert = page.locator(".bg-amber-50");
        this.allEventsTableTitle = page.getByRole("heading", { name: "All Events" });
        this.allEventsTableRowCount = page.locator('span:has-text("total")');
        this.eventCreatedAlert = page.getByText("Event created!");
        this.eventDeletedAlert = page.getByText("Event deleted");
    }

    async goto() {
        await this.page.goto("/admin/events");
    }
}
