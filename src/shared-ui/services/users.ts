import axiosInstance from "./axios";
import { User } from "../models/user";

export async function createUser(user: User): Promise<User> {
  const { data } = await axiosInstance.post<User>("users", user);
  return data;
}

export async function getUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get<User[]>("users");
  return data;
}
