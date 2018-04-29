const getDateString = date => {
  date = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const now = new Date();
  if (
    now.getDate() === day &&
    now.getMonth() === monthIndex &&
    now.getFullYear() === year
  ) {
    return "Today";
  }
  if (now.getFullYear() === year) {
    return day + " " + monthNames[monthIndex];
  }
  return day + " " + monthNames[monthIndex] + " " + year;
};
export default getDateString;
