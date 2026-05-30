export interface Article {
    id: number,
    lang: string,
    title: string,
    subtitle: string,
    text: string,
    date: string,
    main_image: string,
    status: 0 | 1,
    delete_at: string,
    delete_url: string
}

export type ArticleByID = Omit<Article, "delete_at">
export type CreateArticle = Omit<Article, "id" | "lang" | "delete_at" | "title" | "subtitle" | "text" | "main_image" | "status"> & {
    title_es: string,
    title_en: string,
    description_es: string,
    description_en: string,
    subtitle_es: string,
    subtitle_en: string
}

export type UpdateArticle = Omit<Article, "id" | "lang" | "delete_at" | "text" | "main_image" | "status"> & {
    description: string,
    lang: string
}

export type FindArticles = Pick<Article, "id" | "title" | "subtitle" | "date" | "main_image" | "text">