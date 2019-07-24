import axiosInstance from "./axios";

export async function dashboardByManager() {
  const { data } = await axiosInstance.post("dashboard/manager");

  return data;
}
