import { createWord, getWords, updateStatusWord, updateWordTranslations } from "@/controllers/admin/glossary.controller";
import { validateCreateWord, ValidateUpdateStatus, validateUpdateWord } from "@/middlewares/validations/validateWord";
import { validationErrors } from "@/middlewares/validationsErrors";
import { Router } from "express";

const router = Router();

router.get("/", getWords);
router.get("/:id", getWords);
router.post("/create", validateCreateWord, validationErrors, createWord);
router.put("/update/status/:id", ValidateUpdateStatus, validationErrors, updateStatusWord);
router.put("/update/:lang/:id", validateUpdateWord, validationErrors, updateWordTranslations);

export default router;