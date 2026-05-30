import conn from "@/config/db";
import { Article, ArticleByID, FindArticles } from "@/types/articles";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export async function findAllArticles(lang: string) {
    try {
        const [row] = await conn.query<Article[] & RowDataPacket[]>("SELECT a.date, a.id, a.main_image, a.status, a.delete_at, at.lang, at.title, at.subtitle, at.text FROM articles a INNER JOIN articles_translations at ON a.id = at.article_id WHERE at.lang = ?", [lang]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los artículos.");
    }
}

export async function findArticlesByDate() {
    try {
        const [row] = await conn.query<{ id: number, main_image: string }[] & RowDataPacket[]>("SELECT id, main_image FROM articles WHERE delete_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los artículos.");
    }
}

export async function countArticles() {
    try {
        const [row] = await conn.query<{ count: number }[] & RowDataPacket[]>("SELECT COUNT(*) AS count FROM articles WHERE status = 1");
        return row[0].count;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los artículos.");
    }
}

export async function findArticles(lang: string, limit: number, offset: number) {
    try {
        const [row] = await conn.query<FindArticles[] & RowDataPacket[]>(`SELECT a.id, a.date, a.main_image, at.title, at.subtitle, at.text FROM articles a INNER JOIN articles_translations at ON a.id = at.article_id WHERE at.lang = ? AND status = 1 ORDER BY a.date DESC LIMIT ?,? `, [lang, offset, limit]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener los artículos.");
    }
}

export async function findArticleByID(id: number, lang?: string) {
    try {
        const [row] = await conn.query<ArticleByID[] & RowDataPacket[]>("SELECT a.id, a.date, a.main_image, a.delete_url, a.status, at.lang, at.title, at.subtitle, at.text FROM articles a INNER JOIN articles_translations at ON a.id = at.article_id WHERE a.id = ? AND at.lang = ?", [id, lang || "es"]);
        return row;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener el artículo por ID.");
    }
}

export async function insertArticle(date: string, main_image: string, delete_url: string) {
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO articles (date, main_image, delete_url) VALUES (?, ?, ?)", [date, main_image, delete_url]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear el artículo.");
    }
}

export async function insertArticleTranslations(id: number, lang: "es" | "en", title: string, subtitle: string, description: string) {
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO articles_translations (lang, title, subtitle, text, article_id) VALUES (?, ?, ?, ?, ?)", [lang, title, subtitle, description, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al crear las traducciones del artículo.");
    }
}

export async function modifyArticle(date: string, id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE articles SET date = ? WHERE id = ?", [date, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el artículo.");
    }
}

export async function modifyArticleImage(image: string, delete_url: string, id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE articles SET main_image = ?, delete_url = ? WHERE id = ?", [image, delete_url, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar la imagen del artículo.");
    }

}

export async function modifyArticleTranslations(id: number, lang: string, title: string, subtitle: string, text: string) {
    try {
        const [result] = await conn.query<ResultSetHeader>("UPDATE articles_translations SET title = ?, subtitle = ?, text = ? WHERE article_id = ? AND lang = ?", [title, subtitle, text, id, lang]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar las traducciones del artículo.");
    }
}

export async function modifyStatusArticle(id: number, status: 0 | 1) {
    try {
        if (status == 0) {
            const [result] = await conn.query<ResultSetHeader>("UPDATE articles SET status = ?, delete_at = NOW() WHERE id = ?", [status, id]);
            return result;
        } else {
            const [result] = await conn.query<ResultSetHeader>("UPDATE articles SET status = ?, delete_at = NULL WHERE id = ?", [status, id]);
            return result;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error al actualizar el estado del artículo.");
    }
}

export async function deleteArticle(id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("DELETE FROM articles WHERE id = ?", [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar el artículo.");
    }
}

export async function deleteArticleTranslations(id: number) {
    try {
        const [result] = await conn.query<ResultSetHeader>("DELETE FROM articles_translations WHERE article_id = ?", [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error al eliminar las traducciones del artículo.");
    }
}