// src/pages/TimezoneDropdownPage.ts
import { Page } from '@playwright/test';
import { CalendarLocators } from '../pageobjects/CalendarLocators';

export class TimezonePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectRandomTimezone(): Promise<string> {
    // Step 1: Click on the dropdown to reveal the list of timezones
    await this.page.locator(CalendarLocators.dropdownSelector).click();

    // Step 2: Locate all timezone options
    const timezoneOptions = await this.page.locator(CalendarLocators.timezoneOptionSelector);

    // Step 3: Get the total number of options (count)
    const totalOptions = await timezoneOptions.count();

    // Step 4: Generate a random index
    const randomIndex = Math.floor(Math.random() * totalOptions);

    // Step 5: Select the random option
    const randomTimezone = timezoneOptions.nth(randomIndex);
    await randomTimezone.click();

    // Step 6: Optionally return the selected timezone text for logging or validation
    const selectedTimezoneText = await randomTimezone.innerText();
    console.log(`Selected Timezone: ${selectedTimezoneText}`);

    return selectedTimezoneText;
  }
}
