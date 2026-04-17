export const COMMON_SERVICES = {
  getFiveYear() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  },

  nextFiveYear() {
    const currentYear = new Date().getFullYear();
    const years: Record<number, number> = {};

    for (let i = 0; i < 5; i++) {
      years[1 + i] = currentYear + i;
    }
    return years;
  },

  nextMonth() {
    const months: Record<number, string> = {};
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

    for (let i = 0; i < 12; i++) {
      months[i + 1] = monthNames[i % 12];
    }
    return months;
  },
};
