import { expect, test } from '@playwright/test';
import { EventsPage } from '../pages/events.page';
import { loginUser } from '../utils/auth.helper';

test.describe('Events scenarios', { tag: ['@eventsPage'] }, () => {
    let eventsPage: EventsPage;

    test.beforeEach(async ({ page }) => {
        await loginUser(page)
        eventsPage = new EventsPage(page);
        eventsPage.goto()
        await eventsPage.header.verifyActiveLink('Events')
    });

    test('EVENTS_01 : should display upcoming events and filter successfully', async ({ page }) => {
        await expect(eventsPage.upcomingEventsTitle).toBeVisible();
        await expect(eventsPage.upcomingEventsSubTitle).toBeVisible();

        await expect(eventsPage.searchEventsInput).toBeVisible();
        await expect(eventsPage.categoryDropdown).toBeVisible();
        await expect(eventsPage.cityDropdown).toBeVisible();
        await expect(eventsPage.addNewEventButton).toBeVisible();
        await expect(await eventsPage.eventList.cardsLocator.count()).toBeGreaterThan(1)

    });

    test('EVENTS_02 : should display all required elements and details on event cards', async () => {
        await eventsPage.eventList.verifyAllCards()
    });

    test('EVENTS_03 : should navigate to the add event page when clicking the add event button', async ({ page }) => {
        await expect(eventsPage.addNewEventButton).toBeVisible()
        await eventsPage.addNewEventButton.click()

        await expect(page).toHaveURL("/admin/events")
    });

    test('EVENTS_04 : should filter event list dynamically by name or location keyword', async ({ page }) => {
        // by event name
        await eventsPage.searchEventsInput.pressSequentially("Dilli Diwali Mela", { delay: 100 })
        await page.waitForLoadState('networkidle')
        const eventTitle = (await eventsPage.eventList.getCard(0)).eventTitle
        await expect(eventTitle).toContainText("Dilli Diwali Mela")
        await eventsPage.clearFilter.click()

        // by event location
        await eventsPage.searchEventsInput.pressSequentially("Worli", { delay: 100 })
        await page.waitForLoadState('networkidle')
        const eventLocation = (await eventsPage.eventList.getCard(0)).eventLocation
        await expect(eventLocation).toContainText("Worli")
    });

    test('EVENTS_05 : should filter events accurately using combined category and city filters', async ({ page }) => {
        // by event name
        await eventsPage.categoryDropdown.selectOption("Conference")
        await page.waitForLoadState('networkidle')
        const eventType = (await eventsPage.eventList.getCard(0)).eventTypeChip
        await expect(eventType).toContainText("Conference")
        await eventsPage.clearFilter.click()

        // by event location
        await eventsPage.cityDropdown.selectOption("Delhi")
        await page.waitForLoadState('networkidle')
        await eventsPage.eventList.cardsLocator.first().waitFor()
        const eventLocation = (await eventsPage.eventList.getCard(0)).eventLocation
        await expect(eventLocation).toContainText("Delhi")
    });

    test("EVENTS_06 : should display the 'no events found' state when a search yields no matches", async () => {
        // by search
        await eventsPage.searchEventsInput.pressSequentially("test", { delay: 100 })
        await eventsPage.verifyNoEventsFound()
        await eventsPage.clearFilter.click()
        await expect(eventsPage.noEventsFoundIcon).not.toBeVisible()

        // by category
        await eventsPage.categoryDropdown.selectOption("Sports")
        await eventsPage.verifyNoEventsFound()
        await eventsPage.clearFilter.click()
        await expect(eventsPage.noEventsFoundIcon).not.toBeVisible()

        // by city
        await eventsPage.cityDropdown.selectOption("Mumbai")
        await eventsPage.verifyNoEventsFound()
    });

    test('EVENTS_07 : should display the clear filter option when active filters are applied', async ({ page }) => {
        // no filter is applied
        await expect(eventsPage.clearFilter).not.toBeVisible()

        // by search
        await eventsPage.searchEventsInput.pressSequentially("te")
        await expect(eventsPage.clearFilter).toBeVisible()
        await eventsPage.clearFilter.click()

        // by category filter
        await expect(eventsPage.clearFilter).not.toBeVisible()
        await eventsPage.categoryDropdown.selectOption("Conference")
        await expect(eventsPage.clearFilter).toBeVisible()
        await eventsPage.clearFilter.click()

        // by city filter
        await expect(eventsPage.clearFilter).not.toBeVisible()
        await eventsPage.cityDropdown.selectOption("Hyderabad")
        await expect(eventsPage.clearFilter).toBeVisible()
        await eventsPage.clearFilter.click()

        await expect(eventsPage.clearFilter).not.toBeVisible()
    });

    test('EVENTS_08 : should reset active filters and restore the full event list when clear filter is clicked', async ({ page }) => {
        // by search
        await expect(eventsPage.searchEventsInput).toHaveValue("")
        await eventsPage.searchEventsInput.pressSequentially("te")
        await eventsPage.categoryDropdown.selectOption("Conference")
        await eventsPage.cityDropdown.selectOption("Hyderabad")
        await page.waitForLoadState('networkidle')

        await expect(eventsPage.searchEventsInput).toHaveValue("te")
        await expect(eventsPage.categoryDropdown).toHaveValue("Conference")
        await expect(eventsPage.cityDropdown).toHaveValue("Hyderabad")

        await eventsPage.clearFilter.click()
        await expect(eventsPage.searchEventsInput).toHaveValue("")
        await expect(eventsPage.categoryDropdown).toHaveValue("")
        await expect(eventsPage.cityDropdown).toHaveValue("")
    });


});
