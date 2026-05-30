import cron from "node-cron";
import path from "path";
import fs from "fs/promises";

import {
    findArticlesByDate,
    deleteArticle,
    deleteArticleTranslations
} from "@/models/articles.model";

import {
    findEventsByDate,
    deleteEvent,
    deleteEventTranslations
} from "@/models/events.model";

import {
    findWordsByDate,
    deleteWord,
    deleteWordTranslations
} from "@/models/glossary.model";

import {
    findUsersByDate,
    deleteUser
} from "@/models/users.model";

export function startCleanupJob() {
    cron.schedule("0 2 * * *", async () => {
        try {
            console.log("Cleanup job started");

            const [articles, events, words, users] = await Promise.all([
                findArticlesByDate(),
                findEventsByDate(),
                findWordsByDate(),
                findUsersByDate()
            ]);

            await Promise.all([
                Promise.all(articles.map(async ({ id, main_image }) => {
                    await deleteArticleTranslations(id);
                    await deleteArticle(id);
                    await fs.unlink(path.join("public/articles", main_image));
                })),

                Promise.all(events.map(async ({ id, image }) => {
                    await deleteEventTranslations(id);
                    await deleteEvent(id);
                    await fs.unlink(path.join("public/events", image));
                })),

                Promise.all(words.map(async ({ id }) => {
                    await deleteWordTranslations(id);
                    await deleteWord(id);
                })),

                Promise.all(users.map(({ id }) => deleteUser(id)))
            ]);

            console.log("Se ha hecho la inspeccion correctamente.");
        } catch (error) {
            console.error("Error al revisar los registros:", error);
        }
    });
}
