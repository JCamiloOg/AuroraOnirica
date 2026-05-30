import i18n from "@/config/i18n";

export function t(key: string, lang: string, options = {}) {
    return i18n.t(key, { lng: lang, ...options });
}
