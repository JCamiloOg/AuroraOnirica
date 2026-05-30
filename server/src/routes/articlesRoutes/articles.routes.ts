import { getArticles } from "@/controllers/articles.controller";
import { Router } from "express";

const router = Router();

router.get("/", getArticles);

export default router;