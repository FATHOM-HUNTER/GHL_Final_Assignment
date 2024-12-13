export const CalendarLocators = {
    // Locator for the calendar loading indicator (make it more specific)
    calendarLoadedIndicator: 'h4[data-v-9457ca97=""]:has-text("AM")', // Ensures "AM" is visible
  
    // Locator for the next month button
    nextMonthButton: 'button[title="Next month"]',
  
    // Locator for the current year button (button displaying year)
    currentYearButton: 'div.vdpPeriodControl button:has-text("202")', // Specifically targets the year button
  
    // Locator for the current month button (button displaying the month)
    currentMonthButton: 'div.vdpPeriodControl button.text-capitalize',
  
    // Locator for selectable dates
    selectableDates: '.vdpCell.selectable',
  
    // Locator for the AM section
    amSection: '#pick-hours--am',
  
    // Locator for the PM section
    pmSection: '#pick-hours--pm',
  
    // Locator for all AM labels
    amSlots: '#pick-hours--am label',
  
    // Locator for all PM labels
    pmSlots: '#pick-hours--pm label',
  
    // Combined locator for all AM and PM labels
    allSlots: '.pick-hours--am label, .pick-hours--pm label',
  
    // Locator for the "Select Date" button
    selectDateButton: '//*[@id="hl_widget"]/div/div[2]/button',
  
    // Locator for the first name input field
    firstNameInput: '//*[@id="first_name"]',
  
    // Locator for the last name input field
    lastNameInput: '//*[@id="last_name"]',
  
    // Locator for the phone input field
    phoneInput: '//*[@id="phone"]',
  
    // Locator for the email input field
    emailInput: '//*[@id="el__email_3"]/div/div/div/div/input',
  
    // Locator for the consent checkbox
    consentCheckbox: "input[type='checkbox']",
  
    // Locator for the "Book Appointment" button
    bookAppointmentButton: '//*[@id="el__button_7"]/div/div/div/button',

    // Locator for the Timezone Dropdwon Selector
    dropdownSelector: '.multiselect__select',

    // Locator for the Muliple Timezones Available
    timezoneOptionSelector: '.multiselect__element',
  };
  