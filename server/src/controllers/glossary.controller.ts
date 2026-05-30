import { countWords, findWords } from "@/models/glossary.model";
import { GetWords } from "@/types/glossary";
import { t } from "@/utils/t";
import { Request, Response } from "express";

export async function getWords(req: Request<unknown, unknown, unknown, { page: string }>, res: Response<{ message: string, words?: GetWords[], totalPages?: number }>) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const words = await findWords(req.lang, limit, offset);
        const count = await countWords();
        const totalPages = Math.ceil(count / limit);

        res.status(200).json({ message: t("glossary:WORDS_GET_SUCCESS", req.lang), words, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("glossary:WORDS_GET_ERROR", req.lang) });
    }
}