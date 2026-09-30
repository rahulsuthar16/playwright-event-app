import { Locator, Page } from "@playwright/test";
import { EventListComponent } from "./components/event-list.component";
import { FooterComponent } from "./components/footer.component";
import { HeaderComponent } from "./components/header.component";

export class DashboardPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    readonly eventList: EventListComponent;
    // hero section
    readonly discoverAndBookEventsTitle: Locator;
    readonly discoverAndBookEventsSubTitle: Locator;
    readonly browseEventsButton: Locator;
    readonly myBookingsButton: Locator;
    readonly featuredEventsTitle: Locator;
    readonly featuredEventsSubTitle: Locator;
    readonly viewAllLink: Locator;
    readonly readyToExploreNewTitle: Locator;
    readonly browseEventsSubTitle: Locator;
    readonly exploreAllEventsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.eventList = new EventListComponent(page);
        this.discoverAndBookEventsTitle = page.locator("h1.font-extrabold");
        this.discoverAndBookEventsSubTitle = page.locator("p.text-indigo-100");
        this.browseEventsButton = page.getByRole("link", { name: "Browse Events →" });
        this.myBookingsButton = page.locator("a").filter({ hasText: "My Bookings" }).last();
        this.featuredEventsTitle = page.getByRole("heading", { name: "Featured Events" });
        this.featuredEventsSubTitle = page.getByText("Hand-picked upcoming events just for you", { exact: true });
        this.viewAllLink = page.getByRole("link", { name: "View all →" });
        this.readyToExploreNewTitle = page.getByRole("heading", { name: "Ready to experience something new?" });
        this.browseEventsSubTitle = page.getByText("Browse thousands of events across India. Book tickets in seconds.", { exact: true });
        this.exploreAllEventsButton = page.getByRole("button", { name: "Explore All Events" });
    }
}
