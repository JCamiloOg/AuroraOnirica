import { useEffect } from "react";
import "./not-found.css";
import { useNavigate } from "react-router";
import ButtonGlow from "../buttons/button.glow";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";



export default function NotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation("translation", { keyPrefix: "404" });

    useEffect(() => {
        document.title = `404 - ${i18n.language === "en" ? "Page not found" : "Página no encontrada"}`;
    });
    return (
        <div className="container404">
            <div className="row">
                <div className="xs-12 md-6 mx-auto relative h-dvh">
                    <div className="absolute left-1/2 top-1/2 -translate-1/2 space-y-4" >
                        <div className="text-[4rem] font-medium text-center text-gold float" >404</div>
                        <div className="font-light text-center text-base">{t("title")}</div>
                        <div className="font-light text-center text-base">{t("description")}</div>
                        <div className="font-light text-center text-base">{t("description_2")}</div>
                        <center>
                            <ButtonGlow onClick={() => navigate(-1)}>{t("goBack")}</ButtonGlow>
                        </center>
                    </div>
                </div>
            </div>
        </div>

    );
}
