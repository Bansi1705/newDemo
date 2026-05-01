export const CONSTANT = {
  SUCCESS: {
    CREATE: "Data created successfully",
    UPDATE: "Data updated successfully",
    DELETE: "Data deleted successfully",
    FETCH: "Data fetched successfully",
    LOGOUT: "User LogOut successfully",
    LOGIN: "User LogIn successfully",
  },
  ERROR: {
    NETWORK: "Network error, please try again",
    NOT_FOUND: "Data not found",
    COMMON: "Something Went Wrong!",
    LARGE_FILE: "File Is Too Large",
    DATA_NOT_SELECTED:"Please Select a Data"
  },
  MIME_TYPES: {
    IMAGE: ["image/jpg", "image/png", "image/jpeg"],
    PDF: "application/pdf",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    XLS: "application/vnd.ms-excel",
  },
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};
