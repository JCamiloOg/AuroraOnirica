/* Components */
import ButtonGlow from "../buttons/button.glow";
import Card from "../card/card.hexagon";

/* Hooks */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

/* Images */
import handleIcon from "@/assets/icons/handlesIcon.png";
import eyeIcon from "@/assets/icons/eyeIcon.png";
import lightIcon from "@/assets/icons/lightIcon.png";


export default function HeroSection() {
    const { t } = useTranslation("translation", { keyPrefix: "heroSection" });
    const navigate = useNavigate();


    return (
        <>
            <div className="lg:min-h-dvh flex flex-col items-center md:justify-center bg-black/50">
                <h2 data-aos="fade-down" className="font-romance text-4xl md:text-7xl md:mt-40 md:p-0 p-5 mt-30 text-base text-center">{t("slogan")}</h2>
                <ButtonGlow onClick={() => navigate("services")} data-aos="fade-down">{t("explore")}</ButtonGlow>
                <div className=" flex items-center justify-center">
                    <div data-aos="fade-up" className="mt-5 grid grid-cols-12 gap-4 mx-auto w-fit">
                        <div className="xl:col-span-4 md:col-span-6 col-span-12">
                            <Card link="/services/individual" image={handleIcon} text={t("card1")} />
                        </div>
                        <div className="xl:col-span-4 xl:block block md:hidden md:col-span-6 col-span-12">
                            <Card link="/services/conferences" image={eyeIcon} text={t("card2")} />
                        </div>
                        <div className="xl:col-span-4 md:col-span-6  col-span-12">
                            <Card link="/services/encounters" image={lightIcon} text={t("card3")} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}