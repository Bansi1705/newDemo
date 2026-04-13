import { AxiosHeaders } from "axios";
import axiosInstance from "./AxiosInstance";

export const Apiservice = {

  getHeader() {
    const data = sessionStorage.getItem("LoginUser");
    const userData = data ? JSON.parse(data) : null;
    const token = userData?.token || "";
    const header: AxiosHeaders = new AxiosHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer" + " " + [token],
    });
    return header;
  },

  async get(path: string, config = {}) {
    const res = await axiosInstance.get(path, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },

  async post(path: string, data: any, config = {}) {
    const res = await axiosInstance.post(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },

  async put(path: string, data: any, config = {}) {
    const res = await axiosInstance.put(path, data, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },

  async delete(path: string, config = {}) {
    const res = await axiosInstance.delete(path, {
      ...config,
      headers: this.getHeader(),
    });
    console.log(res);
    return res.data;
  },
};
