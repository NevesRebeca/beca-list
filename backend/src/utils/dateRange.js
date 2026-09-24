export function getTodayRange() {
  const startingDate = new Date();
  startingDate.setUTCHours(0, 0, 0, 0);

  const endingDate = new Date();
  endingDate.setUTCHours(23, 59, 59, 999);

  return { startingDate, endingDate };
}
