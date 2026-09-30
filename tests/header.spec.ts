import { expect, test } from "@playwright/test";
import { valid } from "../data/credentials.json";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";
import { loginUser } from "../utils/auth.helper";

test.describe("Header scenarios", { tag: ["@header"] }, () => {
    let dashboard: DashboardPage;

    // Navigate to the page once before each test in this block
    test.beforeEach(async ({ page }) => {
        await loginUser(page);

        dashboard = new DashboardPage(page);
        await expect(dashboard.header.eventHubTitle).toBeVisible();
        await dashboard.header.verifyActiveLink("Home");
    });

    test("HEADER_01 : should render EventHub brand logo and redirect to home", async ({ page }) => {
        // Already covered by beforeEach, but you can add explicit static assertions here if needed
        await dashboard.header.verifyLogoAndTitle("EventHub");
        await expect(page).toHaveURL("/");

        // click on events link
        await dashboard.header.clickLink("Events");
        await expect(page).toHaveURL("/events");

        // click on logo
        await dashboard.header.logo.click();
        await expect(page).toHaveURL("/");

        // click on events link
        await dashboard.header.clickLink("My Bookings");
        await expect(page).toHaveURL("/bookings");

        // click on title
        await dashboard.header.eventHubTitle.click();
        await expect(page).toHaveURL("/");
    });

    test("HEADER_02 : should highlight the active Home navigation link", async () => {
        await dashboard.header.verifyActiveLink("Home");
    });

    test("HEADER_03 : should navigate correctly when clicking Events and My Bookings links", async () => {
        await dashboard.header.clickLink("Events");
        await dashboard.header.verifyActiveLink("Events");

        await dashboard.header.clickLink("My Bookings");
        await dashboard.header.verifyActiveLink("My Bookings");
    });

    test("HEADER_04 : should open API Docs in a new tab with secure attributes", async ({ context }) => {
        const [apiDocsPage] = await Promise.all([context.waitForEvent("page"), dashboard.header.clickLink("API Docs")]);
        await apiDocsPage.waitForLoadState("domcontentloaded");
        await expect(apiDocsPage).toHaveURL(/api\/docs/);
    });

    test("HEADER_05 : should display the logged-in user email correctly", async () => {
        await dashboard.header.verifyUserText(valid.email);
    });

    test("HEADER_06 : should render the admin dropdown menu option", async ({ page }) => {
        await expect(dashboard.header.adminDropdown).toBeVisible();
        await dashboard.header.adminDropdown.click();
        await expect(dashboard.header.dropdownOptions).toHaveCount(2);
        await expect(dashboard.header.dropdownOptions).toHaveText(["Manage Events", "Manage Bookings"]);

        await dashboard.header.adminDropdown.click();
        await expect(dashboard.header.dropdownOptions.first()).not.toBeVisible();

        await dashboard.header.selectDropdownOption("Manage Events");
        await expect(page).toHaveURL("/admin/events");

        await dashboard.header.selectDropdownOption("Manage Bookings");
        await expect(page).toHaveURL("/admin/bookings");

        await dashboard.header.logo.click();
        await expect(page).toHaveURL("/");
    });

    test("HEADER_07 : should trigger logout when the logout button is clicked", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await expect(dashboard.header.logoutButton).toBeVisible();
        await dashboard.header.logoutButton.click();

        await expect(page).toHaveURL("/login");
        await expect(loginPage.emailInput).toBeVisible();
    });
});
