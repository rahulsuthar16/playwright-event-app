// components/event-table.section.ts
import { Page, Locator, expect } from "@playwright/test";
import { DeleteModalComponent } from "./delete-modal.component";

export class EventTableComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly rows: Locator;
    readonly totalCountLabel: Locator;
    readonly tableHeaders: Locator; // Added headers locator
    readonly deleteModal: DeleteModalComponent; // Added headers locator

    constructor(page: Page) {
        this.page = page;
        this.deleteModal = new DeleteModalComponent(page);
        this.section = page.locator("section");
        this.rows = page.locator("tr[data-testid='event-table-row']");
        this.totalCountLabel = this.section.locator("span.text-sm.text-gray-400");
        this.tableHeaders = page.locator("thead th"); //
    }

    /**
     * Verifies that the table headers match the expected column names in order
     */
    async verifyTableHeaders(expectedHeaders: string[] = ["Title", "Category", "City", "Date", "Price", "Seats", "Actions"]) {
        await expect(this.tableHeaders).toHaveText(expectedHeaders);
    }

    /**
     * Gets a specific table row locator by searching for the event title text
     */
    getRowByTitle(title: string): Locator {
        return this.rows.filter({ hasText: title });
    }

    /**
     * Verifies that a specific event row exists and matches expected values
     */
    async verifyEventInTable(data: { title: string; category?: string; city?: string; date?: string; price?: string; hasActions?: boolean }) {
        const row = this.getRowByTitle(data.title);
        await expect(row).toBeVisible();

        if (data.category) {
            await expect(row.locator("td").nth(1)).toContainText(data.category);
        }
        if (data.city) {
            await expect(row.locator("td").nth(2)).toContainText(data.city);
        }
        if (data.date) {
            await expect(row.locator("td").nth(3)).toContainText(data.date);
        }
        if (data.price) {
            await expect(row.locator("td").nth(4)).toContainText(data.price);
        }

        if (data.hasActions) {
            const actionCell = row.locator("td").last();
            await expect(actionCell.getByTestId("edit-event-btn")).toBeVisible();
            await expect(actionCell.getByTestId("delete-event-btn")).toBeVisible();
        } else {
            await expect(row.locator("td").last()).toContainText("Read-only");
        }
    }

    /**
     * Performs an action (edit or delete) on a specific event row based on its title
     */
    async performActionOnEvent(title: string, action: "edit" | "delete") {
        const row = this.getRowByTitle(title);
        await expect(row).toBeVisible();

        // Target the actions column (last <td>) and look for the corresponding button or link
        const actionCell = row.locator("td").last();
        const locatorId = action === "edit" ? "edit-event-btn" : "delete-event-btn";
        const actionButton = actionCell.getByTestId(locatorId);

        await expect(actionButton).toBeVisible();
        await actionButton.click();
    }
}
