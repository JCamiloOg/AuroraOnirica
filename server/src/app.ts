import express from "express";
import cors from "cors";
import { CORS_ORIGIN, NODE_ENV } from "./config/env";
import cookieParser from "cookie-parser";
import routes from "@/routes/index.routes";
import morgan from "morgan";
import { languageMiddlware } from "./middlewares/language.middleware";
import { startCleanupJob } from "./jobs/deleteData.job";
import path from "path";
const app = express();



app.use(cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options(/.*/, cors());

startCleanupJob();

if (NODE_ENV === "development") app.use(morgan("dev"));
if (NODE_ENV === "production") app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(languageMiddlware);

app.use(express.static(path.join(__dirname, "../public")));

console.log(__dirname);

app.use("/images/articles", express.static("public/articles"));
app.use("/images/events", express.static("public/events"));

app.use("/api", routes);


export default app;
