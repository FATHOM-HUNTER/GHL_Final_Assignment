import { test } from '@playwright/test';
import { CalendarPage } from '../pages/CalendarPage';

// Load environment variables from .env file
require('dotenv').config();


test('Random Appointment Booking Testing', async ({ page }) => {
  const calendarPage = new CalendarPage(page);

  // Navigate to the calendar
  await calendarPage.navigateToCalendar();

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
  const { responseBody, eventId, contactId, location_id, first_name, last_name, first_name_lower_case, last_name_lower_case, email, phone, calendarId } = await calendarPage.bookAppointmentAndGetResponse();

  // Log the response data
  console.log('Response:', responseBody);

  // Get Bearer token from environment variables
  const bearerToken = process.env.BEARER_TOKEN;  // Automatically pulled from .env file
  console.log(bearerToken);

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

  const getContactResponse = await page.request.get(contactUrl, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bearerToken}`,
      Version: '2021-07-28',
    },
  });

  // Validate GET responses
  await test.expect(getAppointmentResponse.status()).toBe(200);
  await test.expect(getContactResponse.status()).toBe(200);

  // Validate the response data (e.g., check if the contact data matches)
  const appointmentData = await getAppointmentResponse.json();
  console.log(appointmentData);
  await test.expect(appointmentData.appointment.id).toBe(eventId);
  await test.expect(appointmentData.appointment.calendarId).toBe(calendarId);
  await test.expect(appointmentData.appointment.contactId).toBe(contactId);
  await test.expect(appointmentData.appointment.locationId).toBe(location_id);

  const contactData = await getContactResponse.json();
  console.log(contactData);
  await test.expect(contactData.contact.id).toBe(contactId);
  await test.expect(contactData.contact.locationId).toBe(location_id);
  await test.expect(contactData.contact.firstName).toBe(first_name);
  await test.expect(contactData.contact.lastName).toBe(last_name);
  await test.expect(contactData.contact.firstNameLowerCase).toBe(first_name_lower_case);
  await test.expect(contactData.contact.lastNameLowerCase).toBe(last_name_lower_case);
  await test.expect(contactData.contact.email).toBe(email);
  await test.expect(contactData.contact.phone).toBe(phone);

});
