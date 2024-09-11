export function StringDate(date: Date): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var dateString = "";
  if (date != null) {
    dateString = `${String(date.getDate()).padStart(2, "0")} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  }

  return dateString;
}

export function StringTime(date: Date): string {
  var hours = date != null ? date.getHours() : 0;
  var minutes = date != null ? date.getMinutes() : 0;

  var ampm = hours >= 12 ? "PM" : "AM";
  var hour12 = hours % 12;
  hour12 = hour12 ? hour12 : 12; // the hour '0' should be '12'

  var timeString = "";

  if (date != null) {
    timeString = `${String(hour12).padStart(2, "0")} : ${String(
      minutes
    ).padStart(2, "0")} ${ampm}`;
  }
  return timeString;
}
