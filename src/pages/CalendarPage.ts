// src/pages/CalendarPage.ts
import test, { Page } from '@playwright/test';
import { CalendarLocators } from '../pageobjects/CalendarLocators';
import { faker} from '@faker-js/faker';
import { convertToIndianTimezone } from './TimezoneConversion'; 

export class CalendarPage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl =
      'https://funnel-preview-dot-highlevel-staging.uc.r.appspot.com/widget/bookings/govinda-assignment2';
  }

  // Method to navigate to the calendar with the query parameter
  async navigateToCalendar() {
    const fullUrl = `${this.baseUrl}?widget_type=classic`;
    await this.page.goto(fullUrl);

    // Wait for the calendar's "AM" indicator to appear
    const calendarLoadedIndicator = await this.page.locator(CalendarLocators.calendarLoadedIndicator);
    await calendarLoadedIndicator.waitFor({ state: 'visible' });
  }

  // Method to navigate to the year 2025
  async navigateToYear2025() {
    let currentYearButton = await this.page.locator(CalendarLocators.currentYearButton).innerText();

    // Loop to navigate to the year 2025
    while (!currentYearButton.includes('2025')) {
      await this.page.locator(CalendarLocators.nextMonthButton).click();
      await this.page.waitForTimeout(500); // Adjust wait time if necessary
      currentYearButton = await this.page.locator(CalendarLocators.currentYearButton).innerText();
    }
  }

  // Method to select a random month and validate
  async selectRandomMonthAndValidate() {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    let monthsClicked = 0;

    for (let i = 0; i < randomMonth - 1; i++) {
      await this.page.locator(CalendarLocators.nextMonthButton).click();
      monthsClicked++;
      await this.page.waitForTimeout(500); // Adjust wait time if needed
    }

    const currentMonthButtonText = await this.page.locator(CalendarLocators.currentMonthButton).innerText();
    const currentMonth = currentMonthButtonText.trim();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const expectedMonth = monthNames[randomMonth - 1];

    // Validate that the current month matches the random selection
    await test.expect(currentMonth).toBe(expectedMonth);

    return { randomMonth, currentMonth };
  }

  // Method to select a random date
  async selectRandomDate() {
    // Wait a bit to ensure the calendar has loaded properly before interacting
    const calendarLoadedIndicator = await this.page.locator(CalendarLocators.calendarLoadedIndicator);
    await calendarLoadedIndicator.waitFor({ state: 'visible' });

    const dateElements = await this.page.locator(CalendarLocators.selectableDates).all();

    // Ensure there are selectable dates in the current view
    const availableDates = await Promise.all(
      dateElements.map(async (dateElement) => ({
        date: await dateElement.innerText(),
        element: dateElement,
      }))
    );

    if (availableDates.length === 0) {
      throw new Error('No selectable dates available for the selected month.');
    }

    // Pick a random date from the available options
    const randomIndex = Math.floor(Math.random() * availableDates.length);
    const randomDate = availableDates[randomIndex];

    // Click on the random date
    await randomDate.element.click();

    // Return the selected date for verification
    return randomDate.date;
  }

  // Method to select a random time slot (AM/PM)
  async selectRandomSlot() {
    // Ensure both AM and PM sections are visible before interacting
    await this.page.locator(CalendarLocators.amSection).waitFor({ state: 'visible' });
    await this.page.locator(CalendarLocators.pmSection).waitFor({ state: 'visible' });

    // Get all the available labels from both AM and PM
    const allSlots = await this.page.locator(CalendarLocators.allSlots).all();

    // Ensure there are available slots
    if (allSlots.length === 0) {
      throw new Error('No available slots to select.');
    }

    // Pick a random slot from the available slots
    const randomSlot = allSlots[Math.floor(Math.random() * allSlots.length)];

    // Wait for the slot to be visible before clicking
    await randomSlot.waitFor({ state: 'visible' });

    // Click the label for the selected slot
    await randomSlot.click();
  }

  // Method to click on the "Select Date" button
  async clickSelectDateButton() {
    const selectDateButton = await this.page.locator(CalendarLocators.selectDateButton);
    await selectDateButton.click();

  }

  // Method to fill the last name field
  async fillFirstName() {
    const firstName = faker.person.firstName();
  
    // Slowly input the first name character by character
    const firstNameInput = this.page.locator(CalendarLocators.firstNameInput);
    await firstNameInput.fill('');
    for (const char of firstName) {
      await firstNameInput.type(char);
      await this.page.waitForTimeout(100); // Slight delay for a typing effect
    }
  }
  
  // Method to fill the last name field
  async fillLastName() {
    const lastName = faker.person.lastName();
  
    // Slowly input the last name character by character
    const lastNameInput = this.page.locator(CalendarLocators.lastNameInput);
    await lastNameInput.fill('');
    for (const char of lastName) {
      await lastNameInput.type(char);
      await this.page.waitForTimeout(100); // Slight delay for a typing effect
    }
  }
  
  // Method to fill the phone field with a random 10-digit phone number
  async fillPhoneNumber() {
    const phone = `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`; // Custom 10-digit phone number
  
    // Select the phone input field
    const phoneInput = this.page.locator(CalendarLocators.phoneInput);
  
    // Clear any existing value in the input field
    await phoneInput.fill('');
  
    // Type each digit one at a time
    for (const digit of phone) {
      await phoneInput.type(digit);
      await this.page.waitForTimeout(100); // Adjust the delay if necessary
    }
  }
  
  // Method to fill the email field
  async fillEmail() {
    const email = faker.internet.email();
  
    // Slowly input the email character by character
    const emailInput = this.page.locator(CalendarLocators.emailInput);
    await emailInput.fill('');
    for (const char of email) {
      await emailInput.type(char);
      await this.page.waitForTimeout(100); // Slight delay for a typing effect
    }
  }
    
  //Method to clcik the checkbox
  async clickConsentCheckbox() {
    await this.page.locator(CalendarLocators.consentCheckbox).check();
    // await this.page.locator("input[type='checkbox']").click();
  }

async bookAppointmentAndGetResponse(): Promise<any> {
    // Intercept the network request
    const [response] = await Promise.all([
      this.page.waitForResponse((response) =>
        response.url().includes('/appointment') && response.request().method() === 'POST'
      ),
      this.page.click(CalendarLocators.bookAppointmentButton), // Replace with the correct selector for the "Book" button
      this.page.waitForTimeout(2000)
    ]);


    // Get the response body
    const responseBody = await response.json();
    const eventId = responseBody.id;
    const contactId = responseBody.contact.id;
    const location_id = responseBody.contact.location_id;
    const first_name = responseBody.contact.first_name;
    const first_name_lower_case = responseBody.contact.first_name_lower_case;
    const last_name = responseBody.contact.last_name;
    const last_name_lower_case = responseBody.contact.last_name_lower_case;
    const email = responseBody.contact.email;
    const phone = responseBody.contact.phone;
    const calendarId = responseBody.contact.attribution_source.mediumId;
    const startTime = responseBody.appointment.start_time;
    const endTime = responseBody.appointment.end_time;
    const timeZone = responseBody.appointment.timezone;

    const convertedStartTime = convertToIndianTimezone(startTime, timeZone);
    const convertedEndTime = convertToIndianTimezone(endTime, timeZone);
    
    return {responseBody, eventId, contactId, location_id, first_name, last_name, first_name_lower_case, last_name_lower_case, email, phone, calendarId, startTime: convertedStartTime,
        endTime: convertedEndTime};
  }
  
}
