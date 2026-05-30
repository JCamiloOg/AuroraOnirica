import { upload } from "@/config/uploadFiles";
import { createArticle, getArticles, updateArticleTranslations, updateArticleImage, updateArticleStatus } from "@/controllers/admin/articles.controller";
import { validateCreateArticle, validateUpdateArticle, validateUpdateStatus } from "@/middlewares/validations/validateArticle";
import { validationErrors } from "@/middlewares/validationsErrors";
import { Router } from "express";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticles);
router.post("/create", upload.single("image"), validateCreateArticle, validationErrors, createArticle);
router.put("/update/status/:id", validateUpdateStatus, validationErrors, updateArticleStatus);
router.post("/update/image/:id", upload.single("image"), updateArticleImage);
router.put("/update/:lang/:id", validateUpdateArticle, validationErrors, updateArticleTranslations);

export default router;