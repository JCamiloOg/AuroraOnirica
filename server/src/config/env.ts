import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({
    path: `.env.${env}`
});

console.log(`env loaded: .env.${env}`);

export const DB_HOST = process.env.DB_HOST;
export const PORT = process.env.PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const HOSTNAME = process.env.HOSTNAME;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const SECRET_KEY = process.env.SECRET_KEY;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_PORT = process.env.DB_PORT;
export const API_KEY_IMGBB = process.env.API_KEY_IMGBB;