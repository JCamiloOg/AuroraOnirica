import i18n from "@/config/i18n";

export default function toggleLang() {
    i18n.emit("languageChanging");
    const lang = i18n.resolvedLanguage === "es" ? "en" : "es";
    localStorage.setItem("lang", lang);
    setTimeout(() => {
        i18n.changeLanguage(lang);
    }, 500);

}