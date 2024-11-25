export function DateToString(date: Date | null | undefined): string {
  if (date != null && date != undefined) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  return "";
}

export function TimeToString(date: Date | null | undefined): string {
  if (date != null && date != undefined) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  return "";
}
