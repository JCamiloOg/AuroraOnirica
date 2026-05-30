import conn from "@/config/db";
import { GetWords, Glossary, GlossaryByID } from "@/types/glossary";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function findAllWords(lang: string) {
    try {
        const [row] = await conn.query<Glossary[] & RowDataPacket[]>("SELECT g.id, g.status, g.delete_at, gt.lang, gt.word, gt.description FROM glossary g INNER JOIN glossary_translations gt ON gt.word_id = g.id WHERE gt.lang = ?", [lang]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las palabras.");
    }
}

export async function findWordsByDate() {
    try {
        const [row] = await conn.query<{ id: number }[] & RowDataPacket[]>("SELECT id FROM glossary WHERE delete_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        return row;

    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las palabras.");
    }
}

export async function countWords() {
    try {
        const [row] = await conn.query<{ count: number }[] & RowDataPacket[]>("SELECT COUNT(*) AS count FROM glossary WHERE status = 1");
        return row[0].count;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las palabras.");
    }
}

export async function findWords(lang: string, limit: number, offset: number) {
    try {
        const [row] = await conn.query<GetWords[] & RowDataPacket[]>("SELECT w.id, wt.word, wt.description FROM glossary w INNER JOIN glossary_translations wt ON wt.word_id = w.id WHERE wt.lang = ? AND w.status = 1 ORDER BY w.id DESC LIMIT ?,?", [lang, offset, limit]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener las palabras.");
    }
}

export async function findWordByID(id: number, lang: string) {
    try {
        const [row] = await conn.query<GlossaryByID[] & RowDataPacket[]>("SELECT g.id, g.status, gt.word, gt.description, gt.lang FROM glossary g INNER JOIN glossary_translations gt ON gt.word_id = g.id WHERE g.id = ? AND gt.lang = ?", [id, lang]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener la palabra.");
    }
}


export async function insertWord() {
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO glossary (status) VALUES (?)", [1]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear la palabra.");
    }
}

export async function inserWordTranslations(id: number, word: string, description: string, lang: "es" | "en") {
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO glossary_translations (lang, word, description, word_id) VALUES (?, ?, ?, ?)", [lang, word, description, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear las traducciones de la palabra.");
    }
}

export async function modifyWordTranslations(id: number, word: string, description: string, lang: string) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE glossary_translations SET word = ?, description = ? WHERE word_id = ? AND lang = ?", [word, description, id, lang]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar la palabra.");
    }
}

export async function modifyStatusWord(id: number, status: 0 | 1) {
    try {
        if (status == 0) {
            const [result] = await conn.query<ResultSetHeader>("UPDATE glossary SET status = ?, delete_at = NOW() WHERE id = ?", [status, id]);
            return result;
        } else {
            const [result] = await conn.query<ResultSetHeader>("UPDATE glossary SET status = ?, delete_at = NULL WHERE id = ?", [status, id]);
            return result;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el estado de la palabra.");
    }
}

export async function deleteWord(id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("DELETE FROM glossary WHERE id = ?", [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar la palabra.");
    }
}

export async function deleteWordTranslations(id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("DELETE FROM glossary_translations WHERE word_id = ?", [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar las traducciones de la palabra.");
    }
}