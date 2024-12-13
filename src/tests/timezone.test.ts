import { test } from '@playwright/test';
import { CalendarPage } from '../pages/CalendarPage';
import { TimezonePage } from '../pages/TimezonePage';
import { convertToIndianTimezone } from '../pages/TimezoneConversion';  // Import the helper

// Load environment variables from .env file
require('dotenv').config();

test('Random Timezone Validation Testing', async ({ page }) => {
  const calendarPage = new CalendarPage(page);
  const timezonePage = new TimezonePage(page);

  // Navigate to the calendar
  await calendarPage.navigateToCalendar();

  // Select Random Timezone from the dropdown
  await timezonePage.selectRandomTimezone();

  // Navigate to the year 2025
  await calendarPage.navigateToYear2025();

  // Select a random month and validate
  await calendarPage.selectRandomMonthAndValidate();

  // Select a random date
  const selectedDate = await calendarPage.selectRandomDate();

  // Select a random time slot (AM/PM)
  const selectedSlot = await calendarPage.selectRandomSlot();

  // Log the selected date and time slot for verification
  console.log(`Selected Date: ${selectedDate}`);

  await calendarPage.clickSelectDateButton();

  // Fill the form fields one by one
  await calendarPage.fillFirstName();
  await calendarPage.fillLastName();
  await calendarPage.fillPhoneNumber();
  await calendarPage.fillEmail();

  await calendarPage.clickConsentCheckbox();

  // Book the appointment and get the response
  const { responseBody, eventId, contactId, startTime, endTime, timeZone } = await calendarPage.bookAppointmentAndGetResponse();

  // Log the response data
  console.log('Response:', responseBody);

  // Convert startTime and endTime to Indian Standard Time (IST) using Luxon
  const convertedStartTime = convertToIndianTimezone(startTime, timeZone);
  const convertedEndTime = convertToIndianTimezone(endTime, timeZone);

  // Get Bearer token from environment variables
  const bearerToken = process.env.BEARER_TOKEN;  // Automatically pulled from .env file

  // Check if the token exists
  if (!bearerToken) {
    throw new Error('Bearer token is not set in the environment variables.');
  }

  // Construct URLs for the API calls
  const appointmentUrl = `https://staging.services.leadconnectorhq.com/calendars/events/appointments/${eventId}`;
  const contactUrl = `https://staging.services.leadconnectorhq.com/contacts/${contactId}`;

  console.log(eventId);
  console.log(appointmentUrl);
  console.log(contactUrl);

  // Make the GET requests with Bearer Authorization
  const getAppointmentResponse = await page.request.get(appointmentUrl, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bearerToken}`,
      Version: '2021-04-15',
    },
  });

  // Validate GET responses
  await test.expect(getAppointmentResponse.status()).toBe(200);

  // Validate the response data (e.g., check if the contact data matches)
  const appointmentData = await getAppointmentResponse.json();
  console.log(appointmentData);

  // Compare the converted times with the API response
  await test.expect(appointmentData.appointment.startTime).toBe(convertedStartTime);
  await test.expect(appointmentData.appointment.endTime).toBe(convertedEndTime);

});
