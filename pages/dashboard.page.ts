import { Page } from "@playwright/test";
import { HeaderComponent } from "./components/header.component";
import { FooterComponent } from "./components/footer.component";

export class DashboardPage {
    readonly page: Page
    readonly header: HeaderComponent
    readonly footer: FooterComponent
    
    constructor(page: Page) {
        this.page = page
        this.header = new HeaderComponent(page)
        this.footer = new FooterComponent(page)

    }
}