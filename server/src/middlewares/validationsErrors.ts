import { t } from "@/utils/t";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!req.file?.buffer.toString("base64")) return res.status(400).json({ message: t("events:NOT_FILE_UPLOAD", req.lang) });

    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    next();
}