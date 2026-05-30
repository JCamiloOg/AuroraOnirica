import i18n from "i18next";
import Backend from "i18next-fs-backend";

i18n
    .use(Backend)
    .init({
        fallbackLng: "en",
        lng: "es",
        backend: {
            loadPath: `locales/{{lng}}/{{ns}}.json`,
        },
        preload: ["en", "es"],
        ns: ["auth", "articles", "common", "events", "glossary", "validate"],
        defaultNS: 'common',
    });

export default i18n;