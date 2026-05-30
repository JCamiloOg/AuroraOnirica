import { Router } from "express";
import articleRoutes from "./articlesRoutes/articles.routes";
import eventRoutes from "./eventsRoutes/events.routes";
import glossaryRoutes from "./glossaryRoutes/glossary.routes";
import adminRoutes from "@/routes/admin/admin.routes";

const router = Router();

router.use("/blog", articleRoutes);
router.use("/events", eventRoutes);
router.use("/glossary", glossaryRoutes);
router.use("/admin", adminRoutes);

export default router;