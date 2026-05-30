import { axiosInstance } from "@/config/axios";
import type { Events, GetEvents, UpdateEventTranslations } from "@/types/events";

export async function getAllEvents() {
    return await axiosInstance.get<{ redirect?: string, message: string, events: Events[] }>("/admin/events");
}

export async function getEvents(page: string | number) {
    return await axiosInstance.get<{ message: string, events: GetEvents[], totalPages: number }>(`/events?page=${page}`);
}

export async function getEventByID(id: number, lang?: string) {
    if (lang) return await axiosInstance.get<{ redirect?: string, message: string, events: Omit<Events, "delete_at">[] }>(`/admin/events/${id}?lang=${lang}`);
    else return await axiosInstance.get<{ redirect?: string, message: string, events: Omit<Events, "delete_at">[] }>(`/admin/events/${id}`);
}

export async function createEvent(data: FormData) {
    return await axiosInstance.post<{ message: string }>(`/admin/events/create`, data);
}

export async function updateEventByID(id: number, data: URLSearchParams) {
    return await axiosInstance.put<{ message: string }>(`/admin/events/update/${id}`, data);
}

export async function updateEventByLang(id: number, lang: string, data: UpdateEventTranslations) {
    return await axiosInstance.put<{ message: string }>(`/admin/events/update/${lang}/${id}`, data);
}

export async function updateEventImage(id: number, image: FormData) {
    return await axiosInstance.post(`/admin/events/update/image/${id}`, image);
}

export async function changeStatusEvent(id: number, status: 0 | 1) {
    return await axiosInstance.put<{ message: string }>(`/admin/events/update/status/${id}`, { status });
}