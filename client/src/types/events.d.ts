export interface Events {
    id: number,
    lang: string,
    title: string,
    description: string,
    date: string | Date,
    hour: string,
    modality: "Presencial" | "Virtual",
    address: string,
    inscription_link: string,
    image: string,
    status: 0 | 1,
    delete_at: string | null
}

export type CreateEvent = Omit<Events, "id" | "lang" | "status" | "delete_at" | "image"> & {
    title_es: string,
    title_en: string,
    description_es: string,
    description_en: string
    image: FileList
}

export type UpdateEvent = Pick<Events, "hour" | "modality" | "address" | "inscription_link" | "date">

export type UpdateEventTranslations = Pick<Events, "title" | "description">

export type GetEvents = Pick<Events, "id" | "title" | "description" | "image" | "date" | "hour" | "modality" | "address" | "inscription_link">