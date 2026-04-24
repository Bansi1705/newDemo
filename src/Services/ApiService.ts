import axiosInstance from "./AxiosInstance";

export const Apiservice = {
  getHeader() {
    const data = sessionStorage.getItem("LoginUser");
    const userData = data ? JSON.parse(data) : null;
    const token = userData?.token || "";

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  },

  async get<T>(path: string, config = {}) {
    const res = await axiosInstance.get<T>(path, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },

  async post<T>(path: string, data: unknown, config = {}) {
    const res = await axiosInstance.post<T>(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },

  async put<T>(path: string, data: unknown, config = {}) {
    const res = await axiosInstance.put<T>(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },

  async delete<T>(path: string, config = {}) {
    const res = await axiosInstance.delete<T>(path, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },
};
