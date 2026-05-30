export interface Article {
    id: number,
    lang: string,
    title: string,
    subtitle: string,
    text: string,
    date: string,
    main_image: string,
    status: 0 | 1,
    delete_at: string
}

export type UpdateArticle = Pick<Article, "title" | "subtitle"> & {
    description: string
}

export type GetArticles = Pick<Article, "id" | "title" | "subtitle" | "main_image" | "date" | "text">

export type CreateArticle = {
    title_es: string,
    title_en: string,
    subtitle_es: string,
    subtitle_en: string,
    description_es: string,
    description_en: string,
    image: FileList
}
