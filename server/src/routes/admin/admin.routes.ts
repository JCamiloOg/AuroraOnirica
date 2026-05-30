import { login, verifySession } from "@/controllers/admin/users.controller";
import { Router } from "express";
import { validateLogin } from "@/middlewares/validations/validateUser";
import { validationErrors } from "@/middlewares/validationsErrors";
import { checkAuthAdmin } from "@/middlewares/authAdmin";

import usesrRouter from "./userRoutes/users.routes";
import glossaryRouter from "./glossaryRoutes/glossary.routes";
import eventsRouter from "./eventsRoutes/events.routes";
import articleRouter from "./articlesRoutes/articles.routes";

const router = Router();

router.post("/login", validateLogin, validationErrors, login);
router.get("/login", verifySession);
router.use("/users", checkAuthAdmin, usesrRouter);
router.use("/glossary", checkAuthAdmin, glossaryRouter);
router.use("/events", checkAuthAdmin, eventsRouter);
router.use("/articles", checkAuthAdmin, articleRouter);

export default router;