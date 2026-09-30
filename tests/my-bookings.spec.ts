import { expect, test } from "@playwright/test";
import { MyBookingsPage } from "../pages/my-bookings.page";
import { loginUser } from "../utils/auth.helper";

test.describe("My Bookings scenarios", { tag: ["@bookingPage"] }, () => {
    let myBookingsPage: MyBookingsPage;

    test.beforeEach(async ({ page }) => {
        await loginUser(page);
        myBookingsPage = new MyBookingsPage(page);
        await myBookingsPage.goto();
        await myBookingsPage.header.verifyActiveLink("My Bookings");
    });

    test("MY_BOOKINGS_01 : should display my bookings", async () => {
        await expect(myBookingsPage.myBookingsTitle).toBeVisible();
        await expect(myBookingsPage.myBookingsSubTitle).toBeVisible();

        await expect(myBookingsPage.clearAllBookingsButton).toBeVisible();
        await expect(myBookingsPage.clearBookingHintText).toBeVisible();
    });

    test('MY_BOOKINGS_02 : should display "no booking yet" for no events booked ', async () => {
        await myBookingsPage.verifyNoBooking();
        await expect(myBookingsPage.browseEventsButton).toBeVisible();
    });

    test("MY_BOOKINGS_03 : should navigate to events page when clicking the browse events button", async ({ page }) => {
        await expect(myBookingsPage.browseEventsButton).toBeVisible();
        await myBookingsPage.browseEventsButton.click();

        await expect(page).toHaveURL("/events");
    });
});
