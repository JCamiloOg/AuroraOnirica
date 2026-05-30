export interface Glossary {
    id: number,
    lang: string,
    word: string,
    description: string,
    status: 0 | 1,
    delete_at: string | null
}

export type GetWords = Pick<Glossary, "word" | "description" | "id">
export type GlossaryByID = Pick<Glossary, 'id' | 'word' | 'status' | 'description' | "lang"> 