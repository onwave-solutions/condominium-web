import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "/api"
});

export function setAuthorization(token: string) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default axiosInstance;
