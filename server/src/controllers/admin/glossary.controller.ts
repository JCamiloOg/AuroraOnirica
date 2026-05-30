import { findAllWords, findWordByID, insertWord, inserWordTranslations, modifyStatusWord, modifyWordTranslations } from "@/models/glossary.model";
import { Glossary, GlossaryByID } from "@/types/glossary";
import { t } from "@/utils/t";
import { Request, Response } from "express";


export async function getWords(req: Request<{ id?: number }, unknown, unknown, { lang?: string }>, res: Response<{ message: string, words?: Glossary[] | GlossaryByID[] }>) {
    try {
        const { id } = req.params;
        const { lang } = req.query;
        if (id) {
            const word = await findWordByID(id, lang || req.lang);
            if (!word) return res.status(404).json({ message: t("glossary:WORD_NOT_FOUND", req.lang) });

            return res.status(200).json({ message: t("glossary:WORD_GET_SUCCESS", req.lang), words: word });
        }

        const words = await findAllWords(req.lang);
        return res.status(200).json({ message: t("glossary:WORDS_GET_SUCCESS", req.lang), words });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("glossary:WORDS_GET_ERROR", req.lang) });
    }
}

export async function createWord(req: Request<unknown, unknown, { word_es: string, word_en: string, description_es: string, description_en: string }>, res: Response<{ message: string }>) {
    try {
        const { description_en, description_es, word_en, word_es } = req.body;

        const response = await insertWord();

        await inserWordTranslations(response.insertId, word_es, description_es, "es");
        await inserWordTranslations(response.insertId, word_en, description_en, "en");

        if (response.affectedRows <= 0) return res.status(500).json({ message: t("glossary:WORD_CREATE_ERROR", req.lang) });

        return res.status(201).json({ message: t("glossary:WORD_CREATE_SUCCESS", req.lang) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("glossary:WORD_CREATE_ERROR", req.lang) });
    }
}


export async function updateWordTranslations(req: Request<{ id: string, lang: string }, unknown, { word: string, description: string }>, res: Response<{ message: string }>) {
    try {
        const { id, lang } = req.params;
        const { word, description } = req.body;

        await modifyWordTranslations(Number(id), word, description, lang);

        return res.status(200).json({ message: t("glossary:WORD_UPDATE_SUCCESS", req.lang) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("glossary:WORD_UPDATE_ERROR", req.lang) });
    }
}


export async function updateStatusWord(req: Request<{ id: string }, unknown, { status: 0 | 1 }>, res: Response<{ message: string }>) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const response = await modifyStatusWord(Number(id), status);

        if (response.affectedRows <= 0) return res.status(500).json({ message: t("glossary:WORD_UPDATE_STATUS_ERROR", req.lang) });

        return res.status(200).json({ message: t("glossary:WORD_UPDATE_STATUS_SUCCESS", req.lang) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("glossary:WORD_UPDATE_STATUS_ERROR", req.lang) });
    }
}