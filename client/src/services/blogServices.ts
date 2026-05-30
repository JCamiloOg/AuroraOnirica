import { axiosInstance } from "@/config/axios";
import type { Article, GetArticles, UpdateArticle } from "@/types/blog";

export async function getAllArticles() {
    return await axiosInstance.get<{ redirect?: string, message: string, articles: Article[] }>("/admin/articles");
}

export async function getArticleByID(id: number, lang?: string) {
    if (lang) return await axiosInstance.get<{ redirect?: string, message: string, articles: Omit<Article, "delete_at">[] }>(`/admin/articles/${id}?lang=${lang}`);
    else return await axiosInstance.get<{ redirect?: string, message: string, articles: Omit<Article, "delete_at">[] }>(`/admin/articles/${id}`);
}

export async function getArticles(page: string | number) {
    return await axiosInstance.get<{ message: string, articles: GetArticles[], totalPages: number }>(`/blog?page=${page}`);
}

export async function createArticle(data: FormData) {
    return await axiosInstance.post<{ message: string }>(`/admin/articles/create`, data);
}

export async function changeStatusArticle(id: number, status: 0 | 1) {
    return await axiosInstance.put<{ message: string }>(`/admin/articles/update/status/${id}`, { status });
}

export async function updateArticleByLang(id: number, lang: string, data: UpdateArticle) {
    return await axiosInstance.put<{ message: string }>(`/admin/articles/update/${lang}/${id}`, data);
}

export async function updateArticleImage(id: number, image: FormData) {
    return await axiosInstance.post(`/admin/articles/update/image/${id}`, image);
}