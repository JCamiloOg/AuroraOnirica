import { t } from "@/utils/t";
import { Request } from "express";
import { body, param } from "express-validator";

export const validateCreateArticle = [
    body(["title_es", "title_en"])
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:requiredTitle", req.lang);
        })
        .isString()
        .withMessage(((_, { req }: { req: Request }) => {
            return t("validate:isStringTitle", req.lang);
        }))
        .isLength({ min: 3, max: 40 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxTitle", req.lang);
        }),
    body(["subtitle_es", "subtitle_en"])
        .trim()
        .notEmpty()
        .withMessage(((_, { req }: { req: Request }) => {
            return t("validate:requiredSubtitle", req.lang);
        }))
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:isStringSubtitle", req.lang);
        })
        .isLength({ min: 3, max: 40 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxSubtitle", req.lang);
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
        .isLength({ min: 50, max: 20000 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxDescription", req.lang);
        })
];


export const validateUpdateArticle = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:idNotFound", req.lang);
        }),
    body("title")
        .trim()
        .notEmpty()
        .withMessage((_, { req }) => {
            return t("validate:requiredTitle", req.lang);
        })
        .isString()
        .withMessage((_, { req }) => {
            return t("validate:isStringTitle", req.lang);
        })
        .isLength({ min: 3, max: 40 })
        .withMessage((_, { req }) => {
            return t("validate:minMaxTitle", req.lang);
        }),
    body("subtitle")
        .trim()
        .notEmpty()
        .withMessage((_, { req }) => {
            return t("validate:requiredSubtitle", req.lang);
        })
        .isString()
        .withMessage((_, { req }) => {
            return t("validate:isStringSubtitle", req.lang);
        })
        .isLength({ min: 3, max: 40 })
        .withMessage((_, { req }) => {
            return t("validate:minMaxSubtitle", req.lang);
        }),
    body("description")
        .trim()
        .notEmpty()
        .withMessage((_, { req }) => {
            return t("validate:requiredDescription", req.lang);
        })
        .isString()
        .withMessage(((_, { req }) => {
            return t("validate:isStringDescription", req.lang);
        }))
        .isLength({ min: 10, max: 20000 })
        .withMessage((_, { req }) => {
            return t("validate:minMaxDescription", req.lang);
        }),
];

export const validateUpdateStatus = [
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

