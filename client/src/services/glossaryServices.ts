import { axiosInstance } from "@/config/axios";
import type { CreateWord, GetWords, UpdateWord, Word } from "@/types/glossary";

export async function getAllWords() {
    return await axiosInstance.get<{ redirect?: string, message: string, words: Word[] }>("/admin/glossary");
}

export async function getWords(page: number) {
    return await axiosInstance.get<{ message: string, words: GetWords[], totalPages: number }>(`/glossary?page=${page}`);
}

export async function getWordByID(id: number, lang?: string) {
    if (lang) return await axiosInstance.get<{ redirect?: string, message: string, words: Omit<Word, "delete_at">[] }>(`/admin/glossary/${id}?lang=${lang}`);
    else return await axiosInstance.get<{ redirect?: string, message: string, words: Omit<Word, "delete_at">[] }>(`/admin/glossary/${id}`);
}


export async function createWord(data: CreateWord) {
    return await axiosInstance.post<{ message: string }>(`/admin/glossary/create`, data);
}

export async function updateWord(id: number, data: UpdateWord, lang: string) {
    return await axiosInstance.put<{ message: string }>(`/admin/glossary/update/${lang}/${id}`, data);
}

export async function changeStatusWord(id: number, status: 0 | 1) {
    return await axiosInstance.put<{ message: string }>(`/admin/glossary/update/status/${id}`, { status });
}