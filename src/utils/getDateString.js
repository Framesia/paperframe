const getDateString = date => {
  date = new Date(date);
  date = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  );
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
    const hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    const minute =
      date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    return `${hour}:${minute} Today`;
  }
  if (now.getFullYear() === year) {
    return day + " " + monthNames[monthIndex];
  }
  return day + " " + monthNames[monthIndex] + " " + year;
};
export default getDateString;
