export const formatDate = (date: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',  // Use 'short' for abbreviated month (e.g., "Oct.")
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',  // Add minute to display time
    hour12: true,       // Use 12-hour format with AM/PM
  };

  // Convert the date to local time zone before formatting
  const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'local' }));

  return localDate.toLocaleString('en-US', options); // Use 'en-US' for desired formatting
};
