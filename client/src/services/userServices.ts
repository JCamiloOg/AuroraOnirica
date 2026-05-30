import { axiosInstance } from "@/config/axios";
import type { Login, UpdateUser, User } from "@/types/users";

export async function login(data: Login) {
    return await axiosInstance.post<{ message: string, redirect?: string }>("/admin/login", data);
}

export async function verifySession() {
    return await axiosInstance.get<{ message: string, redirect?: string }>("/admin/login");
}

export async function logout() {
    return await axiosInstance.post<{ message: string, redirect: string }>("/admin/users/logout");
}

export async function createUser(data: Pick<User, "username" | "password">) {
    return await axiosInstance.post<{ message: string }>(`/admin/users/create`, data);
}

export async function getAllUsers() {
    return await axiosInstance.get<{ redirect?: string, message: string, users: User[] }>("/admin/users");
}

export async function getUserByID(id: number) {
    return await axiosInstance.get<{ redirect?: string, message: string, user: Omit<User, "delete_at"> }>(`/admin/users/${id}`);
}

export async function updateUser(id: number, data: UpdateUser) {
    return await axiosInstance.put<{ message: string }>(`/admin/users/update/${id}`, data);
}

export async function updateStatus(id: number, status: 0 | 1) {
    return await axiosInstance.put<{ message: string }>(`/admin/users/updateStatus/${id}`, { status });
}