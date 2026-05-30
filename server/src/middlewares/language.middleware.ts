import { getLangFromHeader } from "@/utils/formatHeaderLanguage";
import { NextFunction, Request, Response } from "express";


export function languageMiddlware(req: Request, _: Response, next: NextFunction) {
    req.lang = (req.headers["accept-language"] as string) ?? "es";
    next();
}

