import { body } from "express-validator";
import { t } from "@/utils/t";
import { Request } from "express";

export const validateUser = [
    body("username")
        .trim()
        .isLength({ min: 8, max: 15 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameLength", req.lang);
        })
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameRequired", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameIsString", req.lang);
        }),

    body("password")
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordLength", req.lang);
        })
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordRequired", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordIsString", req.lang);
        })
        .matches(/^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/)
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordFormat", req.lang);
        })
];

export const validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameRequired", req.lang);
        }),

    body("password")
        .trim()
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordRequired", req.lang);
        })
];

export const validateUpdateStatus = [
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

export const validateUpdateUser = [
    body("username")
        .trim()
        .isLength({ min: 4, max: 15 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameUpdateLength", req.lang);
        })
        .notEmpty()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameRequired", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:usernameIsString", req.lang);
        }),

    body("password")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 8 })
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordMinLength", req.lang);
        })
        .isString()
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordIsString", req.lang);
        })
        .matches(/^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/)
        .withMessage((_, { req }: { req: Request }) => {
            return t("validate:passwordFormat", req.lang);
        })
];
