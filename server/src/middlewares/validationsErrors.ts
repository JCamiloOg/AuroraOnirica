import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { unlink } from "fs";

export function validationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        if (req.file) {
            unlink(req.file.path, () => { });
        }

        return res.status(400).json({ message: errors.array()[0].msg });
    }

    next();
}