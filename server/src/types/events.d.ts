export interface Events {
    id: number,
    lang: string,
    title: string,
    description: string,
    date: string,
    hour: string,
    modality: "Presencial" | "Virtual",
    address: string | null,
    inscription_link: string | null,
    image: string,
    status: 0 | 1,
    delete_at: string | null,
    delete_url: string
}


export type EventsByID = Omit<Events, "delete_at">

export type CreateEvent = Omit<Events, "id" | "lang" | "delete_at" | "status" | "title" | "description" | "image"> & {
    title_es: string,
    title_en: string,
    description_es: string,
    description_en: string
}

export type UpdateEvent = Omit<Events, "id" | "lang" | "delete_at" | "status" | "title" | "description" | "image">

export type updateEventTranslations = Pick<Events, "title" | "description">

export type FindEvents = Pick<Events, "date" | "hour" | "address" | "image" | "inscription_link" | "modality" | "id" | "title" | "description">

