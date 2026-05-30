import { createUser, getUsers, logout, updateStatus, updateUser } from "@/controllers/admin/users.controller";
import { validateUpdateStatus, validateUpdateUser, validateUser } from "@/middlewares/validations/validateUser";
import { validationErrors } from "@/middlewares/validationsErrors";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUsers);
router.post("/logout", logout);
router.post("/create", validateUser, validationErrors, createUser);
router.put("/update/:id", validateUpdateUser, validationErrors, updateUser);
router.put("/updateStatus/:id", validateUpdateStatus, validationErrors, updateStatus);

export default router;