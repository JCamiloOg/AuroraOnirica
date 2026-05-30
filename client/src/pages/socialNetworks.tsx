import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import SectionSocial from "@/components/socialNetworks/sectionSocial";
import i18n from "@/config/i18n";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useEffect, useState } from "react";

export default function SocialNetworks() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);
    const lang = i18n.language;

    useEffect(() => {
        document.title = lang === "en" ? "Contact" : "Contacto";
    }, [lang]);

    useEffect(() => {
        startLoading();

        const timer = setTimeout(() => stopLoading(), 500);

        return () => {
            clearTimeout(timer);
        };
    }, [startLoading, stopLoading, lang]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);


    return (
        <>
            <Loader isVisible={loading || loadingLanguaje} />
            <NavBar />
            <SectionSocial />
        </>
    );
}