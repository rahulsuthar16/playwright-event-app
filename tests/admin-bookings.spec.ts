import { expect, test } from '@playwright/test';
import { AdminBookingsPage } from '../pages/admin-booking.page';
import { loginUser } from '../utils/auth.helper';

test.describe('Manage Bookings scenarios', { tag: ['@adminBookings'] }, () => {
    let adminBookingsPage: AdminBookingsPage;

    test.beforeEach(async ({ page }) => {
        await loginUser(page)
        adminBookingsPage = new AdminBookingsPage(page);
        await adminBookingsPage.goto()
        await adminBookingsPage.header.verifyActiveLink('Admin')
    });

    test('MANAGE_BOOKINGS_01 : should display my bookings', async ({ page }) => {
        await expect(adminBookingsPage.manageBookingsTitle).toBeVisible();
        await expect(adminBookingsPage.manageBookingsSubTitle).toBeVisible();

        await expect(adminBookingsPage.bookingStatusDropdown).toBeVisible();
    });

    test('MANAGE_BOOKINGS_02 : should display "no bookings found" for no events booked ', async () => {
        await adminBookingsPage.verifyNoBooking()
    });


});
