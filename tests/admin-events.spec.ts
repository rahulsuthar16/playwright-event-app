import { expect, test } from '@playwright/test';
import { AdminEventsPage } from '../pages/admin-events.page';
import { loginUser } from '../utils/auth.helper';
import eventsData from '../data/event-data.json'

const workShopEventData = eventsData.workshopEvent

test.describe('Manage Bookings scenarios', { tag: ['@adminBookings'] }, () => {
    let adminEventsPage: AdminEventsPage;

    test.beforeEach(async ({ page }) => {
        await loginUser(page)
        adminEventsPage = new AdminEventsPage(page);
        await adminEventsPage.goto()
        await adminEventsPage.header.verifyActiveLink('Admin')
    });

    test('MANAGE_EVENTS_01 : should display add new event form', async () => {
        await expect(adminEventsPage.formTitle).toBeVisible();
        await expect(adminEventsPage.formInfoAlert).toBeVisible();
    });

    test('MANAGE_EVENTS_02 : should display form with all required elements ', async () => {
        await expect(adminEventsPage.createEventForm.titleInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.descriptionInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.categorySelect).toBeVisible();
        await expect(adminEventsPage.createEventForm.cityInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.venueInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.dateTimeInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.priceInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.totalSeatsInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.imageUrlInput).toBeVisible();
        await expect(adminEventsPage.createEventForm.submitButton).toBeVisible();
    });

    test('MANAGE_EVENTS_03 : should display error for required fields', async () => {
        await adminEventsPage.createEventForm.submitForm()
        await adminEventsPage.createEventForm.verifyAllRequiredFieldErrors()

    });

    test("MANAGE_EVENTS_04 : should successfully create a Workshop event", async () => {
        await adminEventsPage.createEventForm.fillEventForm(workShopEventData);
        await adminEventsPage.createEventForm.submitForm();
        await expect(adminEventsPage.eventCreatedAlert).toBeVisible()

    });

    test('MANAGE_EVENTS_05 : should display all events in tabular format', async () => {
        await adminEventsPage.allEventsTableTitle.scrollIntoViewIfNeeded()
        await expect(adminEventsPage.allEventsTableTitle).toBeVisible();
        await expect(adminEventsPage.allEventsTableRowCount).toBeVisible();

        await adminEventsPage.eventTable.verifyTableHeaders()
        await adminEventsPage.eventTable.verifyEventInTable({
            title: "Dilli Diwali Mela",
            category: "Festival",
            city: "Delhi",
            //price: "$300"
        })
    });

    test("MANAGE_EVENTS_06 : should display newly created Workshop event in table", async ({ page }) => {
        await page.waitForLoadState('networkidle')

        await adminEventsPage.eventTable.verifyEventInTable({
            title: workShopEventData.title,
            category: workShopEventData.category,
            city: workShopEventData.city,
            //price: event.price,
            //date:event.dateTime,
            hasActions: true
        })

    });

    test("MANAGE_EVENTS_07 : should able to edit newly created Workshop event in table", async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await adminEventsPage.eventTable.performActionOnEvent(workShopEventData.title, "edit")
        await adminEventsPage.createEventForm.verifyFormValues({
            title: workShopEventData.title,
            description: workShopEventData.description,
            category: workShopEventData.category,
            city: workShopEventData.city,
            venue: workShopEventData.venue,
            dateTime: workShopEventData.dateTime,
            // price:workShopEventData.price,
            totalSeats: workShopEventData.totalSeats,
            imageUrl: workShopEventData.imageUrl,
        })
        await expect(adminEventsPage.createEventForm.updateEventButton).toBeVisible();
        await expect(adminEventsPage.createEventForm.cancelEditButton).toBeVisible();
    });

    test("MANAGE_EVENTS_07 : should able to delete newly created Workshop event in table", async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await adminEventsPage.eventTable.performActionOnEvent(workShopEventData.title, "delete")
        await adminEventsPage.eventTable.deleteModal.verifyModalVisible()
        await adminEventsPage.eventTable.deleteModal.cancelButton.click()

        await expect(adminEventsPage.eventTable.deleteModal.cancelButton).not.toBeVisible()
        await adminEventsPage.eventTable.performActionOnEvent(workShopEventData.title, "delete")
        await adminEventsPage.eventTable.deleteModal.confirmDelete()
        await expect(adminEventsPage.eventTable.deleteModal.cancelButton).not.toBeVisible()
        await expect(adminEventsPage.eventDeletedAlert).toBeVisible()
    });

});

/**
 * TODO: 
 * 
1. Create Alert
2. Find the event card
3. Start Booking
4. Fill booking form
5. Verify booking confirmation
6. verify in my bookings
7. verify seat reduction


Two separate tests — one booking with 1 ticket should show "Eligible for refund", a booking with 3 tickets should show "Not eligible for refund".

 */