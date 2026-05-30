/* components */
import HeroSection from "@/components/heroSection.tsx/heroSection";
import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import CardGold from "@/components/card/card.gold";
import { useTranslation } from "react-i18next";
import Footer from "@/components/footer/footer";
import ButtonGlow from "@/components/buttons/button.glow";
import WaButton from "@/components/buttons/waButton/waButton";
import CardImage from "@/components/card/card.image";

/* Hooks */
import { useEffect, useState } from "react";
import { usePageLoader } from "@/hooks/usePageLoader";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { useNavigate } from "react-router";

/* Images */
import eyeIcon from "@/assets/icons/eyeIcon.png";
import doorIcon from "@/assets/icons/doorIcon.png";
import brainGold from "@/assets/icons/brainGold.png";
import bookMagic from "@/assets/icons/bookMagic.png";
import celestialIcons from "@/assets/icons/celestialIcons.png";
import eyeGoldIcon from "@/assets/icons/eyeGoldIcon.png";
import goldFlower from "@/assets/icons/goldFlower.png";
import redLines from "@/assets/icons/redLines.png";
import omar from "@/assets/elias-varela.png";


export default function Index() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const { t } = useTranslation("translation", { keyPrefix: "index" });
    const navigate = useNavigate();


    const [loadingLanguaje, setLoadingLanguaje] = useState(false);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);

    useEffect(() => {
        document.title = "Aurora Onirica";
        startLoading();

        const timer = setTimeout(() => stopLoading(), 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [startLoading, stopLoading]);

    return (
        <>
            <NavBar />
            <Loader isVisible={loading || loadingLanguaje} />
            <WaButton />
            <HeroSection />
            <section className="mx-auto max-w-7xl px-4">
                <article className="flex flex-wrap justify-center  md:gap-10 mt-20">
                    <div data-aos="fade-up">
                        <CardGold image={doorIcon} title={t("mission")} text={t("missionDescription")} isTop />
                    </div>
                    <div className="relative">
                        <img src={redLines} className="absolute top-50 scale-200" alt="" />
                    </div>
                    <div data-aos="fade-down">
                        <CardGold image={eyeIcon} title={t("vision")} text={t("visionDescription")} isTop />
                    </div>
                </article>

                <article className="grid grid-cols-12 gap-4 mt-20">
                    <div data-aos="fade" className="md:col-span-4 justify-center col-span-12">
                        <center>
                            <CardImage title="Elías Varela" image={omar} />
                        </center>
                    </div>
                    <div data-aos="fade" className="md:col-span-8 col-span-12 text-base font-liberation text-justify  w-full md:text-lg lg:text-2xl   border-2 border-[#f2cc8a] bg-black/50 p-10 rounded-3xl flex flex-col items-center justify-center">
                        <div>
                            {t("bioOmar")}
                        </div>
                        <ButtonGlow onClick={() => navigate("/about-us", { state: { scrollTo: "biography" } })}>{t("readMore")}</ButtonGlow>
                    </div>
                </article>

                <article className="grid grid-cols-12 gap-4 mt-20">
                    <div data-aos="fade-up" className="md:col-span-5 col-span-12">
                        <h2 className="md:text-6xl text-5xl text-gold font-romance">{t("philosophy.title")}</h2>
                        <div className="flex  items-center">
                            <img src={brainGold} className="w-30" alt="" />
                            <p className="text-base font-liberation md:text-xl">{t("philosophy.point-1")}</p>
                        </div>
                        <div className="flex  items-center">
                            <img src={bookMagic} className="w-30" alt="" />
                            <p className="text-base font-liberation md:text-xl">{t("philosophy.point-2")}</p>
                        </div>
                        <div className="flex  items-center">
                            <img src={celestialIcons} className="w-30" alt="" />
                            <p className="text-base font-liberation md:text-xl">{t("philosophy.point-3")} </p>
                        </div>
                        <div className="flex  items-center">
                            <img src={goldFlower} className="w-20 ms-5" alt="" />
                            <p className="text-base font-liberation md:text-xl ms-5">{t("philosophy.point-4")}</p>
                        </div>
                    </div>
                    <div className="md:block hidden col-span-2 relative h-full">
                        <img src={eyeGoldIcon} className="scale-300 absolute top-50 z-[-1] opacity-60" alt="" />
                    </div>
                    <div data-aos="fade-down" className="md:col-span-5 col-span-12 flex items-end justify-end">
                        <div>
                            <h2 className="md:text-6xl text-5xl text-gold text-center mb-5 font-romance">{t("methodology.title")}</h2>
                            <p className="text-base text-xl text-center font-liberation">{t("methodology.p-1")}</p>
                            <br />
                            <p className="text-base text-xl text-center font-liberation">{t("methodology.p-2")}</p>
                        </div>
                    </div>
                </article>

                <article data-aos="fade" className="relative  mt-20">
                    <img src={eyeGoldIcon} className="md:block hidden absolute w-100 z-[-1] bottom-37.5 opacity-40 left-1/2 -translate-x-1/2 " alt="" />
                    <div className="border-2 font-liberation border-[#f2cc8a] bg-black/50 md:p-15 p-10 rounded-2xl  md:text-4xl text-center text-base">
                        {t("purpose")}
                    </div>
                </article>
            </section>

            <Footer />

        </>
    );
}