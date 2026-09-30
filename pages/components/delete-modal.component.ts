// components/delete-modal.component.ts
import { Page, Locator, expect } from "@playwright/test";

export class DeleteModalComponent {
    readonly page: Page;
    readonly modal: Locator;
    readonly modalTitle: Locator;
    readonly modalMessage: Locator;
    readonly cancelButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Scope everything within the active dialog role
        this.modal = page.locator("div[role='dialog'][aria-labelledby='modal-title']");

        this.modalTitle = this.modal.locator("#modal-title");
        this.modalMessage = this.modal.locator("p.text-sm.text-gray-600");
        this.cancelButton = this.modal.locator("button", { hasText: "Cancel" });
        this.confirmDeleteButton = this.modal.locator("#confirm-dialog-yes");
        this.closeButton = this.modal.locator("button[aria-label='Close']");
    }

    /**
     * Verifies that the delete confirmation modal is visible with correct text
     */
    async verifyModalVisible() {
        await expect(this.modal).toBeVisible();
        await expect(this.modalTitle).toHaveText("Delete this event?");
        await expect(this.modalMessage).toContainText("This will permanently delete the event");
    }

    /**
     * Clicks the 'Delete event' confirmation button
     */
    async confirmDelete() {
        await expect(this.confirmDeleteButton).toBeVisible();
        await this.confirmDeleteButton.click();
    }

    /**
     * Clicks the 'Cancel' button to dismiss the modal
     */
    async cancelDelete() {
        await expect(this.cancelButton).toBeVisible();
        await this.cancelButton.click();
    }
}
