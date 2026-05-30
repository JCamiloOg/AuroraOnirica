import conn from "@/config/db";
import { Events, EventsByID, FindEvents } from "@/types/events";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function findAllEvents(lang: string) {
    try {
        const [row] = await conn.query<Events[] & RowDataPacket[]>("SELECT e.id, e.date, e.hour, e.modality, e.address, e.inscription_link, e.image, e.status, e.delete_at, e.delete_url, et.lang, et.title, et.description FROM events e INNER JOIN events_translations et ON e.id = et.event_id WHERE et.lang = ?", [lang]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los eventos.");
    }
}

export async function findEventsByDate() {
    try {
        const [row] = await conn.query<{ id: number, image: string }[] & RowDataPacket[]>("SELECT id, image FROM events WHERE delete_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los eventos.");
    }
}

export async function countEvents() {
    try {
        const [row] = await conn.query<{ count: number }[] & RowDataPacket[]>("SELECT COUNT(*) AS count FROM events WHERE status = 1");
        return row[0].count;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los eventos.");
    }
}

export async function findEvents(lang: string, limit: number, offset: number) {
    try {
        const [row] = await conn.query<FindEvents[] & RowDataPacket[]>("SELECT e.id, e.date, e.hour, e.modality, e.address, e.inscription_link, e.image, et.title, et.description FROM  events e INNER JOIN events_translations et ON e.id = et.event_id WHERE et.lang = ? AND status = 1 ORDER BY e.date DESC LIMIT ?,? ", [lang, offset, limit]);

        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los eventos.");
    }
}


export async function findEventsByID(id: number, lang?: string) {
    try {
        const [row] = await conn.query<EventsByID[] & RowDataPacket[]>("SELECT e.id, e.date, e.hour, e.modality, e.address, e.inscription_link, e.image, e.status, et.lang, et.title, et.description FROM events e INNER JOIN events_translations et ON e.id = et.event_id WHERE e.id = ? AND et.lang = ?", [id, lang || "es"]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener el evento.");
    }
}

export async function insertEvent(date: string, hour: string, modality: "Presencial" | "Virtual", address: string | null, inscription_link: string | null, image: string, delete_url: string) {
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO events (date, hour, modality, address, inscription_link, image, delete_url) VALUES (?, ?, ?, ?, ?, ?, ?)", [date, hour, modality, address, inscription_link, image, delete_url]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear el evento.");
    }
}

export async function insertEventTranslations(id: number, lang: "es" | "en", title: string, description: string) {
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO events_translations (lang, title, description, event_id) VALUES (?, ?, ?, ?)", [lang, title, description, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear las traducciones del evento.");
    }
}

export async function modifyEvent(date: string, hour: string, modality: "Presencial" | "Virtual", address: string | null, inscription_link: string | null, id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE events SET date = ?, hour = ?, modality = ?, address = ?, inscription_link = ? WHERE id = ?", [date, hour, modality, address, inscription_link, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el evento.");
    }
}

export async function modifyEventImage(image: string, delete_url: string, id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE events SET image = ?, delete_url = ? WHERE id = ?", [image, delete_url, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar la imagen del evento.");
    }
}

export async function modifyEventTranslations(lang: string, title: string, description: string, id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE events_translations SET title = ?, description = ? WHERE event_id = ? AND lang = ?", [title, description, id, lang]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar las traduccionesn del evento.");
    }
}

export async function modifyStatusEvent(status: 0 | 1, id: number) {
    try {
        if (status == 0) {
            const [result] = await conn.query<ResultSetHeader>("UPDATE events SET status = ?, delete_at = NOW() WHERE id = ?", [status, id]);
            return result;
        } else {
            const [result] = await conn.query<ResultSetHeader>("UPDATE events SET status = ?, delete_at = NULL WHERE id = ?", [status, id]);
            return result;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el estado del evento.");
    }
}

export async function deleteEvent(id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("DELETE FROM events WHERE id = ?", [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar el evento.");
    }
}

export async function deleteEventTranslations(id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("DELETE FROM events_translations WHERE event_id = ?", [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar las traducciones del evento.");
    }
}