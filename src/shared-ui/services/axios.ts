import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "/"
});

export default axiosInstance;
