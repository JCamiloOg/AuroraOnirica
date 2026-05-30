import { countEvents, findEvents } from "@/models/events.model";
import { FindEvents } from "@/types/events";
import { t } from "@/utils/t";
import { Request, Response } from "express";

export async function getEvents(req: Request<unknown, unknown, unknown, { page: string }>, res: Response<{ message: string, events?: FindEvents[], totalPages?: number }>) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const events = await findEvents(req.lang, limit, offset);
        const count = await countEvents();
        const totalPages = Math.ceil(count / limit);

        res.status(200).json({ message: t("events:EVENTS_GET_SUCCESS", req.lang), events, totalPages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: t("events:EVENTS_GET_ERROR", req.lang) });
    }
}