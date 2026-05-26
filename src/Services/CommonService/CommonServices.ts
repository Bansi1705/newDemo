import { format } from "date-fns";
import { toast } from "react-toastify";

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

  formatValue(name: string | undefined, value: number | string | undefined) {
    if (!name) return;
    if (value === null || value === undefined) return "-";

    const stringValue = value.toString();

    if (
      name.toLowerCase().includes("occupancy") ||
      name.toLowerCase().includes("gop")
    ) {
      if (stringValue.includes("%")) {
        return stringValue;
      }

      return `${value}%`;
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
      return Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }

    if (typeof value === "string" && value.includes("%")) {
      const num = parseFloat(value);
      return !isNaN(num) ? `${num.toFixed(2)}%` : value;
    }

    const num = Number(value);
    return !isNaN(num) ? num.toFixed(2) : "-";
  },

  formatDate(dateString: string) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  },

  formatCreateDate(date: string) {
    return format(new Date(date), "dd MMM yyyy");
  },

  formatText(text?: string) {
    if (!text) return "-";
    const replacedText = text.toLowerCase().replaceAll("_", " ");
    return replacedText.charAt(0).toUpperCase() + replacedText.slice(1);
  },

  sortData<T>(data: T[], sortOrder: "asc" | "desc", sortKey: string) {
    return [...data].sort((a, b) => {
      const currentValue = a[sortKey as keyof T];
      const nextValue = b[sortKey as keyof T];

      if (typeof currentValue === "string" && typeof nextValue === "string") {
        return sortOrder === "asc"
          ? currentValue.localeCompare(nextValue)
          : nextValue.localeCompare(currentValue);
      }

      if (typeof currentValue === "number" && typeof nextValue === "number") {
        return sortOrder === "asc"
          ? currentValue - nextValue
          : nextValue - currentValue;
      }

      return 0;
    });
  },

  formtePhoneNumber(value: string) {
    const digit = value.replace(/\D/g, "");
    let formatted = "";

    if (digit.length > 0) {
      if (digit[0] == "1") {
        formatted = `+${digit.slice(0, 1)}`;
      } else {
        if (!toast.isActive("phone-error")) {
          toast.error("Please Enter a Number Which Start with +1", {
            toastId: "phone-error",
          });
        }
      }
    }
    if (digit.length > 1) {
      formatted += `(${digit.slice(1, 4)})`;
    }
    if (digit.length > 4) {
      formatted += ` ${digit.slice(4, 7)}`;
    }
    if (digit.length > 7) {
      formatted += `-${digit.slice(7, 11)}`;
    }
    return formatted;
  },
};
