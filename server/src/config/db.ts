import sql from "mysql2/promise";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./env";

const conn = sql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: Number(DB_PORT),
});

conn.on("connection", () => {
    console.log("Database connected");
});

export default conn;