import { toast } from "react-toastify";

export const TOASTER = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  SUCCESS: {
    CREATE: () => toast.success("Data created successfully"),
    UPDATE: () => toast.success("Data updated successfully"),
    DELETE: () => toast.success("Data deleted successfully"),
    FETCH: () => toast.success("Data fetched successfully"),
    LOGIN: () => toast.success("User Login successfully"),
    LOGOUT: () => toast.success("User Logout successfully"),
    FILE_DOWNLOAD: () => toast.success("File downloaded successfully"),
  },

  ERROR: {
    NOT_FOUND: () => toast.error("Data not found"),
    COMMON: () => toast.error("Something went wrong!"),
    PREVIEW_FAIL: () => toast.error("File preview failed"),
  },

  WARNING: {
    LARGE_IMAGE_FILE: () => toast.warning("File size must be less than 5 MB"),
    LARGE_VIDEO_FILE: () => toast.warning("File size must be less than 10 MB"),
    DATA_NOT_SELECTED: () => toast.warning("Please select data"),
    INVALID_FILE_TYPE: () => toast.warning("Invalid File Type"),
  },
};
