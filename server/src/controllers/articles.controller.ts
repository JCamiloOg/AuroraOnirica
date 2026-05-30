import { countArticles, findArticles } from "@/models/articles.model";
import { FindArticles } from "@/types/articles";
import { t } from "@/utils/t";
import { Request, Response } from "express";

export async function getArticles(req: Request<unknown, unknown, unknown, { page: string }>, res: Response<{ message: string, articles?: FindArticles[], totalPages?: number }>) {
    try {
        const page = parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page);
        const limit = 10;
        const offset = (page - 1) * limit;

        const articles = await findArticles(req.lang, limit, offset);
        const count = await countArticles();
        const totalPages = Math.ceil(count / limit);


        res.status(200).json({ message: t("articles:ARTICLES_GET_SUCCESS", req.lang), articles, totalPages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: t("articles:ARTICLES_GET_ERROR", req.lang) });
    }
}