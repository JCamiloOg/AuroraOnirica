import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findAllUsers, findUserByID, findUserByUserName, insertUser, modifyPassword, modifyStatusUser, modifyUser } from "@/models/users.model";
import { SECRET_KEY } from "@/config/env";
import crypto from "crypto";
import { token, User, UserByID } from "@/types/user";
import { t } from "@/utils/t";


export async function login(req: Request<unknown, unknown, { username: string; password: string; }>, res: Response<{ message: string; redirect?: string; }>) {
    try {
        const { username, password } = req.body;
        const user = await findUserByUserName(username);

        if (!user) return res.status(404).json({ message: t("auth:USER_NOT_FOUND", req.lang) });
        if (user.status === 0) return res.status(401).json({ message: t("auth:INACTIVE_USER", req.lang) });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(401).json({ message: t("auth:INVALID_PASSWORD", req.lang) });

        if (!SECRET_KEY) throw new Error(t("auth:SECRET_KEY", req.lang));

        const token = jwt.sign({ id: user.id, status: user.status }, SECRET_KEY, { expiresIn: "72h" });

        res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 60 * 60 * 1000 * 72 });

        return res.status(200).json({ message: t("auth:LOGIN_SUCCESSFUL", req.lang), redirect: "/admin/blog" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("auth:LOGIN_ERROR", req.lang) });
    }
}

export async function verifySession(req: Request, res: Response) {
    try {
        const token: string = req.cookies.token;

        if (!token) res.status(401).json({ message: t("auth:UNHAUTHORIZED", req.lang) });
        if (!SECRET_KEY) throw new Error(t("auth:SECRET_KEY", req.lang));

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) res.status(401).json({ message: t("auth:UNHAUTHORIZED", req.lang) });

            const user = decode as token;

            if (user.status === 0) res.status(401).json({ message: t("auth:UNHAUTHORIZED", req.lang) });

            res.status(200).json({ message: t("auth:SESSION_VERIFIED", req.lang), redirect: "/admin/blog" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: t("auth:VERIFY_SESSION_ERROR", req.lang) });
    }
}

export async function createUser(req: Request<unknown, unknown, { username: string; password: string; }>, res: Response<{ message: string; }>) {
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).json({ message: "El usuario y la contraseña son obligatorios." });

        const user = await findUserByUserName(username);

        if (user) return res.status(400).json({ message: "El usuario ya existe." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const ID = crypto.randomBytes(20).toString("hex");

        const response = await insertUser(ID, username, hashedPassword);

        if (response.affectedRows <= 0) return res.status(500).json({ message: "Error al crear el usuario." });

        return res.status(201).json({ message: "Usuario creado correctamente." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el usuario." });
    }
}

export async function getUsers(req: Request<{ id?: string }>, res: Response<{ message: string, users?: User[], user?: UserByID }>) {
    try {
        const { id } = req.params;

        if (id) {
            const user = await findUserByID(id);
            if (!user) res.status(404).json({ message: "Usuario no encontrado." });

            return res.status(200).json({ message: "Usuario obtenido correctamente.", user: user });
        }
        const users = await findAllUsers();
        // await removeUsers();
        return res.status(200).json({ message: "Usuarios obtenidos correctamente.", users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los usuarios." });
    }
}

export async function updateUser(req: Request<{ id: string }, unknown, { username: string; password: string; }>, res: Response<{ message: string; }>) {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await Promise.all([
                modifyUser(id, username),
                modifyPassword(id, hashedPassword)
            ]);
        } else {
            await modifyUser(id, username);
        }

        return res.status(200).json({ message: "Usuario actualizado correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el usuario." });
    }
}

export async function updateStatus(req: Request<{ id: string; }, unknown, { status: 0 | 1; }>, res: Response<{ message: string; }>) {
    try {
        const { id } = req.params;
        const { status } = req.body;


        const response = await modifyStatusUser(id, status);

        if (response.affectedRows <= 0) return res.status(500).json({ message: "Error al actualizar el estado del usuario." });

        res.status(200).json({ message: "Estado del usuario actualizado correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estado del usuario." });
    }
}

export async function logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: t("auth:LOGOUT_SUCCESSFUL", req.lang), redirect: "/" });
}