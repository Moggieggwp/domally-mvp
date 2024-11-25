export function getMonthNames(month: number): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[month];
}

export function getFormatMMMonth(month: number): string {
  const monthNumber = month + 1;
  return monthNumber < 10 ? '0' + monthNumber : '' + monthNumber;
}

export function getFormatMMDate(date: number): string {
  return date < 10 ? '0' + date : '' + date;
}

export function getFormattedDate(dateData: Date) {
  if (!dateData) return null;
  const date = new Date(dateData);

  const year = date.getFullYear();
  const month = getMonthNames(date.getMonth());
  const day = getFormatMMDate(date.getDate());

  return month + ' ' + day + ' ' + year;
}

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;

  return strTime;
}

export function compareDates(date1: Date, date2: Date): boolean {
  const date1Compare = `${date1.getDate()}/${date1.getDay()}/${date1.getFullYear()}`;
  const date2Compare = `${date2.getDate()}/${date2.getDay()}/${date2.getFullYear()}`;
  return date1Compare == date2Compare;
}
