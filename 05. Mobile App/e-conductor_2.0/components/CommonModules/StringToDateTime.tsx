export default function StringToDate(dateString: string, timeString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  // Default seconds to 0 if not provided
  const secondsValue = isNaN(seconds) ? 0 : seconds;

  // Note: Month is 0-indexed in JavaScript Date object, so subtract 1 from month
  return new Date(year, month - 1, day, hours, minutes, secondsValue);
}
