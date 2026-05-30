import { getEvents } from "@/controllers/events.controller";
import { Router } from "express";

const router = Router();

router.get("/", getEvents);

export default router;