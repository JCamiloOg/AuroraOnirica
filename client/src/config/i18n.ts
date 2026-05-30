import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

const storedLang = localStorage.getItem("lang");

const initialLang = storedLang || navigator.language.split("-")[0] || "es";


i18n
    .use(initReactI18next)
    .init({
        resources: { en: { translation: en }, es: { translation: es } },
        lng: initialLang,
        fallbackLng: "es",
        interpolation: { escapeValue: false },
        supportedLngs: ["es", "en"],
        nonExplicitSupportedLngs: true,
        load: "languageOnly",
    });


export default i18n;
