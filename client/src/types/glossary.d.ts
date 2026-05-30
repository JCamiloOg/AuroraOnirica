export interface Word {
    id: number,
    word: string,
    description: string,
    lang: string,
    status: 0 | 1,
    delete_at: string
}


export type CreateWord = {
    word_es: string,
    word_en: string,
    description_es: string,
    description_en: string
}

export type UpdateWord = Pick<Word, "word" | "description">

export type GetWords = Pick<Word, "id" | "word" | "description">
