import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/"
})

export const Apiservice = {
 
    async get(path : any, config = {}) {
        const res = await api.get(path, config);
        return res.data
    },
    async post(path : any, config = {}) {
        return api.post(path, config).then(res => res.data);
    },
    async put(path : any, config = {}) {
        return api.put(path, config).then(res => res.data);
    },
    async delete(path : any, config = {}) {
        return api.delete(path, config).then(res => res.data);
    }
}