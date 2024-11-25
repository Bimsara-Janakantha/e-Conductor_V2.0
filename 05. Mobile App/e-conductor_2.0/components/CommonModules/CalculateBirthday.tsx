import { DateToString } from "../../components/CommonModules/DateTimeToString";

export default function calculateBirthday(nic: string): string {
    let year = parseInt(nic.substring(0, 4), 10); // Extract year
    let days = parseInt(nic.substring(4, 7), 10); // Extract days
    // Create a date object for January 1 of the given year
    const startDate = new Date(year, 0, 1); // January is month 0 in JavaScript
    // Add the number of days
    const birthday = new Date(startDate);
    birthday.setDate(startDate.getDate() + days-1);

    return DateToString(birthday);
  }