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

  async get<T>(path: string, config = {}): Promise<T> {
    const res = await axiosInstance.get<T>(path, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },

  async post<T, B = unknown>(path: string, data: B, config = {}): Promise<T> {
    const res = await axiosInstance.post<T>(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },

  async put<T, B = unknown>(path: string, data: B, config = {}): Promise<T> {
    const res = await axiosInstance.put<T>(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },

  async delete<T>(path: string, config = {}): Promise<T> {
    const res = await axiosInstance.delete<T>(path, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },
};
