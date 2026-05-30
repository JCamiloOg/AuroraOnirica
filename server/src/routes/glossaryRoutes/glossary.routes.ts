import { getWords } from "@/controllers/glossary.controller";
import { Router } from "express";

const router = Router();

router.get("/", getWords);

export default router;