import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "api"
});

export default axiosInstance;
