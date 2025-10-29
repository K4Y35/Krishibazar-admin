import moment from "moment";
export function formatDateTime(dateInput: any): string {
  const date = new Date(dateInput);
  // console.log(date, dateInput, "datedfate");
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const period = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour time to 12-hour format
  hours = hours % 12 || 12; // if hours % 12 is 0, it should be 12
  const formattedHours = pad(hours);

  return `${year}-${month}-${day} ${" "} ${formattedHours}:${minutes} ${period}`;
}

export function formatDate(dateInput: Date | string): string {
  return moment(dateInput).format("Do MMMM YYYY");
}
