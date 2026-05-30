import i18n from "@/config/i18n";
import type { Dispatch, SetStateAction } from "react";

export default function onChangeLanguage(setValue: Dispatch<SetStateAction<boolean>>, action?: () => void) {
    i18n.on("languageChanging", () => {
        // window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setValue(true);
    });
    i18n.on("languageChanged", () => {
        const timer = setTimeout(() => {
            if (action) action();
            setValue(false);
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    });


}