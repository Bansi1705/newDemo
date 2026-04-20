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

  getPercentageColor(actual: number, budget: number) {
    const percent = (actual / budget) * 100;

    if (percent > 100) return "red";
    if (percent > 75) return "orange";
    if (percent > 50) return "green";
    return "black";
  },

  formatValue(name: string, value: number) {
    if (!name) return;
    if (value === null || value === undefined) return "-";

    if (
      name.toLowerCase().includes("occupancy") ||
      name.toLowerCase().includes("gop")
    ) {
      return value + "%";
    }

    if (
      name.toLowerCase().includes("adr") ||
      name.toLowerCase().includes("revpar") ||
      name.toLowerCase().includes("profit") ||
      name.toLowerCase().includes("expense") ||
      name.toLowerCase().includes("income") ||
      name.toLowerCase().includes("subtotal") ||
      name.toLowerCase().includes("revenue") ||
      name.toLowerCase().includes("admin") ||
      name.toLowerCase().includes("marketing") ||
      name.toLowerCase().includes("maintenance") ||
      name.toLowerCase().includes("utilities")
    ) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }

    return value;
  },
};
