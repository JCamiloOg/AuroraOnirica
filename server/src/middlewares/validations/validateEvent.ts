import { t } from "@/utils/t";
import { Request } from "express";
import { body, param } from "express-validator";

export const validateCreateEvent = [
    body(["title_es", "title_en"])
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:requiredTitle", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:isStringTitle", req.lang);
        })
        .isLength({ min: 3, max: 40 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxTitle", req.lang);
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
        .isLength({ min: 10, max: 20000 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxDescription", req.lang);
        }),

    body("date")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:dateRequired", req.lang);
        })
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:dateInvalid", req.lang);
        }),

    body("hour")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:timeRequired", req.lang);
        })
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:timeInvalid", req.lang);
        }),

    body("modality")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:modalityRequired", req.lang);
        })
        .isIn(["Presencial", "Virtual"])
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:modalityInvalid", req.lang);
        }),

    body("address")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:addressIsString", req.lang);
        })
        .isLength({ min: 3, max: 100 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:adressLenght", req.lang);
        }),

    body("inscription_link")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:linkIsString", req.lang);
        })
        .isLength({ min: 3, max: 500 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:linkLenght", req.lang);
        })
];

export const validateUpdateEventTranslations = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:idNotFound", req.lang);
        }),

    param("lang")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:langRequired", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:langIsString", req.lang);
        }),

    body("title")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:requiredTitle", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:isStringTitle", req.lang);
        })
        .isLength({ min: 3, max: 40 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxTitle", req.lang);
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
        .isLength({ min: 10, max: 20000 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:minMaxDescription", req.lang);
        })
];

export const validateUpdateEvent = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:idNotFound", req.lang);
        }),

    body("date")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:dateRequired", req.lang);
        })
        .isDate({ format: "YYYY-MM-DD", strictMode: true })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:dateInvalid", req.lang);
        }),

    body("hour")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:timeRequired", req.lang);
        })
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:timeInvalid", req.lang);
        }),

    body("modality")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:modalityRequired", req.lang);
        })
        .isIn(["Presencial", "Virtual"])
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:modalityInvalid", req.lang);
        }),

    body("address")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:addressIsString", req.lang);
        })
        .isLength({ min: 3, max: 100 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:adressLenght", req.lang);
        }),

    body("inscription_link")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:linkIsString", req.lang);
        })
        .isLength({ min: 3, max: 500 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:linkLenght", req.lang);
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
