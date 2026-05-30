import { t } from "@/utils/t";
import { Request } from "express";
import { body, param } from "express-validator";

export const validateCreateWord = [
    body(["word_es", "word_en"])
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:wordRequired", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:wordIsString", req.lang);
        })
        .isLength({ min: 3, max: 30 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:wordLenght", req.lang);
        }),

    body(["description_es", "description_en"])
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:requiredDescription", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:isStringDescription", req.lang);
        })
        .isLength({ min: 10, max: 5000 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxDescription", req.lang);
        })
];

export const validateUpdateWord = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:idNotFound", req.lang);
        }),

    body("word")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:wordRequired", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:wordIsString", req.lang);
        })
        .isLength({ min: 3, max: 30 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:wordLenght", req.lang);
        }),

    body("description")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:requiredDescription", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:isStringDescription", req.lang);
        })
        .isLength({ min: 10, max: 5000 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxDescription", req.lang);
        })
];

export const ValidateUpdateStatus = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:idNotFound", req.lang);
        }),

    body("status")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:requiredStatus", req.lang);
        })
        .isIn([0, 1])
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:isNumericStatus", req.lang);
        })
];
