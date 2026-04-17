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

  async get(path: string, config = {}) {
    const res = await axiosInstance.get(path, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },

  async post(path: string, data: any, config = {}) {
    const res = await axiosInstance.post(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },

  async put(path: string, data: any, config = {}) {
    const res = await axiosInstance.put(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },

  async delete(path: string, config = {}){
    const res = await axiosInstance.delete(path, {
      ...config,
      headers: this.getHeader(),
    });
    return res;
  },
};
