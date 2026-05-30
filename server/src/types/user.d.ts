import { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

export interface User {
    id: string,
    user: string,
    password: string,
    status: 0 | 1,
    delete_at: string | null
}

export type UserByID = Pick<User, 'id' | 'user' | 'status' | "password"> & RowDataPacket;
export type userByUserName = Pick<User, "id" | "status" | "password" | "user"> & RowDataPacket;
export type token = Pick<User, "id" | "status"> & JwtPayload;