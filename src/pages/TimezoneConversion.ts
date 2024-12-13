import { DateTime } from 'luxon';

export const convertToIndianTimezone = (date: string, fromTimezone: string): string => {
  // Parse the provided date and time using Luxon and the original timezone
  const formattedDate = DateTime.fromFormat(date, 'EEE, MMM d, yyyy h:mm a', { zone: fromTimezone });

  // Convert it to Indian Standard Time (IST)
  const indianTime = formattedDate.setZone('Asia/Kolkata');

  // Return the converted time in ISO 8601 format
  return indianTime.toISO();  // This returns the date in 'yyyy-MM-dd'T'HH:mm:ss.SSSZZ' format
};
