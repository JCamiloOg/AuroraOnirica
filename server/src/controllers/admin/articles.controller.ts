import { findAllArticles, findArticleByID, insertArticle, insertArticleTranslations, modifyArticleImage, modifyArticleTranslations, modifyStatusArticle } from "@/models/articles.model";
import { Article, ArticleByID, CreateArticle, UpdateArticle } from "@/types/articles";
import { t } from "@/utils/t";
import { Request, Response } from "express";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";
import { API_KEY_IMGBB } from "@/config/env";
import { ResponseImgBB } from "@/types/imgBB";
import { sqlFormatDate } from "@/utils/formatDate";


export async function getArticles(req: Request<{ id: string }, unknown, unknown, { lang?: string }>, res: Response<{ message: string, articles?: Article[] | ArticleByID[] }>) {
    try {
        const { id } = req.params;
        const { lang } = req.query;
        if (id) {
            const article = await findArticleByID(Number(id), lang || req.lang);

            if (!article) return res.status(404).json({ message: t("articles:ARTICLE_NOT_FOUND", req.lang) });

            return res.status(200).json({ message: t("articles:ARTICLE_GET_SUCCESS", req.lang), articles: article });
        }

        const articles = await findAllArticles(req.lang);

        return res.status(200).json({ message: t("articles:ARTICLES_GET_SUCCESS", req.lang), articles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: t("articles:ARTICLES_GET_ERROR", req.lang) });
    }
}


export async function createArticle(req: Request<unknown, unknown, CreateArticle>, res: Response) {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({ message: t("NOT_FILE_UPLOAD", req.lang) });

        const filePath = file.buffer;


        const webp = await sharp(filePath)
            .toFormat("webp")
            .toBuffer();

        const form = new FormData();

        form.append("image", webp.toString("base64"));

        const { data } = await axios.post<ResponseImgBB>(
            `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
            form,
            {
                headers: form.getHeaders()
            }
        );


        const { title_es, title_en, subtitle_es, subtitle_en, description_es, description_en } = req.body;

        const date = sqlFormatDate(new Date());

        const response = await insertArticle(date, data.data.url, data.data.delete_url);

        await Promise.all([
            insertArticleTranslations(response.insertId, "es", title_es, subtitle_es, description_es),
            insertArticleTranslations(response.insertId, "en", title_en, subtitle_en, description_en)
        ]);

        return res.status(201).json({ message: t("articles:ARTICLE_CREATED", req.lang) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: t("articles:ARTICLE_ERROR_CREATED", req.lang) });
    }
}

export async function updateArticleTranslations(req: Request<{ id: string, lang: string }, unknown, UpdateArticle>, res: Response<{ message: string }>) {
    try {
        const { id, lang } = req.params;
        const { description, subtitle, title } = req.body;


        await modifyArticleTranslations(Number(id), lang, title, subtitle, description);


        return res.status(200).json({ message: t("articles:ARTICLE_UPDATED", req.lang) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: t("articles:ARTICLE_ERROR_UPDATED", req.lang) });
    }
}

export async function updateArticleImage(req: Request<{ id: string }>, res: Response<{ message: string }>) {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({ message: t("NOT_FILE_UPLOAD", req.lang) });

        const { id } = req.params;

        const filePath = file.buffer;

        const webp = await sharp(filePath)
            .toFormat("webp")
            .toBuffer();

        const form = new FormData();

        form.append("image", webp.toString("base64"));

        const { data } = await axios.post<ResponseImgBB>(
            `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
            form,
            {
                headers: form.getHeaders()
            }
        );


        const [article] = await Promise.all([
            findArticleByID(Number(id)),
            modifyArticleImage(data.data.url, data.data.delete_url, Number(id))
        ]);

        await axios.get(article[0].delete_url);

        return res.status(200).json({ message: t("articles:ARTICLE_UPDATE_IMAGE_SUCCESS", req.lang) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: t("articles:ARTICLE_UPDATE_IMAGE_ERROR", req.lang) });
    }
}


export async function updateArticleStatus(req: Request<{ id: string }, unknown, { status: 0 | 1 }>, res: Response) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const response = await modifyStatusArticle(Number(id), status);

        if (response.affectedRows <= 0) return res.status(500).json({ message: t("articles:ARTICLE_UPDATE_STATUS_ERROR", req.lang) });

        return res.status(200).json({ message: t("articles:ARTICLE_UPDATE_STATUS_SUCCESS", req.lang) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: t("articles:ARTICLE_UPDATE_STATUS_ERROR", req.lang) });
    }
}