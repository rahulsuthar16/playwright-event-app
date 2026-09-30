import { expect, test } from "@playwright/test";
import { valid } from "../data/credentials.json";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";

test.describe("Featured Events scenarios", { tag: ["@featuredEvents"] }, () => {
    let dashboard: DashboardPage;

    // Navigate to the page once before each test in this block
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(valid.email, valid.password);
        await expect(page).toHaveURL("/");
        dashboard = new DashboardPage(page);
        await expect(dashboard.header.eventHubTitle).toBeVisible();
    });

    test("FEATURED_EVENTS_01 : should render hero section with quick action button", async ({ page }) => {
        await expect(dashboard.discoverAndBookEventsTitle).toBeVisible();
        await expect(dashboard.browseEventsSubTitle).toBeVisible();

        // click on events link
        await expect(dashboard.browseEventsButton).toBeVisible();
        await dashboard.browseEventsButton.click();
        await expect(page).toHaveURL("/events");
        await dashboard.header.logo.click();

        // click my bookings
        await expect(dashboard.myBookingsButton).toBeVisible();
        await dashboard.myBookingsButton.click();
        await expect(page).toHaveURL("/bookings");
    });

    test("FEATURED_EVENTS_02 : should render featured events section with top 3 events", async ({ page }) => {
        await expect(dashboard.featuredEventsTitle).toBeVisible();
        await expect(dashboard.featuredEventsSubTitle).toBeVisible();
        await expect(dashboard.viewAllLink).toBeVisible();
        await page.waitForLoadState("networkidle");
        await dashboard.eventList.verifyCardCount(3);
    });

    test("FEATURED_EVENTS_03 : should navigate correctly when clicking on view all link", async ({ page }) => {
        await expect(dashboard.viewAllLink).toBeVisible();
        await dashboard.viewAllLink.click();

        await expect(page).toHaveURL("/events");
    });

    test("FEATURED_EVENTS_04 : should render events cards correctly", async () => {
        await dashboard.eventList.verifyAllCards();
    });

    test("FEATURED_EVENTS_05 : should render ready to explore section with explore button", async ({ page }) => {
        await expect(dashboard.readyToExploreNewTitle).toBeVisible();
        await expect(dashboard.browseEventsSubTitle).toBeVisible();

        await expect(dashboard.exploreAllEventsButton).toBeVisible();
        await dashboard.exploreAllEventsButton.click();
        await expect(page).toHaveURL("/events");
    });
});
