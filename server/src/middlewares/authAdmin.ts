import { SECRET_KEY } from "@/config/env";
import { token } from "@/types/user";
import { t } from "@/utils/t";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function checkAuthAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const token: string = req.cookies.token;
        let user: token = { id: "", status: 0 };

        if (!token) return res.status(400).json({ redirect: "/" });

        if (!SECRET_KEY) throw new Error(t("auth.SECRET_KEY", req.lang));

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.status(400).json({ redirect: "/" });

            user = decode as token;
        });

        if (user.status === 0) return res.status(400).json({ redirect: "/" });

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ redirect: "/" });
    }
}