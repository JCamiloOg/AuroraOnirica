export const getLangFromHeader = (acceptLanguage?: string): "es" | "en" => {
    if (!acceptLanguage) return "es";

    const supported = ["es", "en"];

    const languages = acceptLanguage
        .split(",")
        .map(lang => {
            const [code, qValue] = lang.trim().split(";q=");
            return {
                lang: code.split("-")[0],
                q: qValue ? parseFloat(qValue) : 1
            };
        })
        .sort((a, b) => b.q - a.q);

    for (const { lang } of languages) {
        if (supported.includes(lang)) {
            return lang as "es" | "en";
        }
    }

    return "es";
};
