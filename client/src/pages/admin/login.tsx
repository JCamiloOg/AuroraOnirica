import FormLogin from "@/components/admin/form";
import Loader from "@/components/loader/loader";
import i18n from "@/config/i18n";
import { usePageLoader } from "@/hooks/usePageLoader";
import { verifySession } from "@/services/userServices";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import img from "@/assets/astroTree.webp";

export default function Login() {
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);

    const onLoad = useCallback(async () => {
        try {
            startLoading();
            const response = await verifySession();

            if (response.status === 200) navigate(response.data?.redirect || "/admin/login");

        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }, [navigate, startLoading, stopLoading]);

    useEffect(() => {
        onLoad();
    }, [onLoad]);

    useEffect(() => {
        i18n.on("languageChanging", () => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            setLoadingLanguaje(true);
        });
        i18n.on("languageChanged", () => {
            const timer = setTimeout(() => {
                setLoadingLanguaje(false);
            }, 500);
            return () => {
                clearTimeout(timer);
            };
        });

    }, []);

    return (
        <>
            <Loader isVisible={loading || loadingLanguaje} />
            <div className="h-screen bg-cover bg-center relative bg-no-repeat" style={{ backgroundImage: `url(${img})` }}>
                <FormLogin />
            </div>
        </>
    );
}