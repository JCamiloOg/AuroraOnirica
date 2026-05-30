/* Components */
import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import Footer from "@/components/footer/footer";
import CardHover from "@/components/card/card.hover";

/* Hooks */
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
/* Images */
import logo from "@/assets/logoAurora.png";
import omar from "@/assets/elias-varela.png";
import astroMision from "@/assets/astro.avif";
import astroVision from "@/assets/astroTree.webp";

/* Config */
import i18n from "@/config/i18n";

/* CSS */
import "@/styles/profileInfo.css";
import { useLocation } from "react-router";
import WaButton from "@/components/buttons/waButton/waButton";

export default function AboutUs() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);
    const { t } = useTranslation("translation", { keyPrefix: "aboutUs" });
    const lang = i18n.language;
    const location = useLocation();

    useEffect(() => {
        document.title = lang === "en" ? "About us" : "Quienes somos";
    }, [lang]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);

    useEffect(() => {
        const id = (location.state as { scrollTo?: string })?.scrollTo;

        if (!id) return;

        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", });
    }, [location]);

    useEffect(() => {
        startLoading();

        const timer = setTimeout(() => stopLoading(), 1000);

        return () => clearTimeout(timer);
    }, [startLoading, stopLoading]);


    return (
        <>
            <Loader isVisible={loading || loadingLanguaje} />
            <WaButton />
            <NavBar />

            <section className="bg-black/50  md:px-20 px-5">
                <h1 data-aos="fade" className=" font-romance text-gold text-center lg:text-7xl text-4xl  pt-40">Aurora Onírica</h1>
                <div data-aos="fade-up" className="grid grid-cols-12 gap-5">
                    <div className="lg:col-span-6 col-span-12 text-justify text-base font-liberation  lg:text-2xl mt-10">
                        <p>
                            {t("creadoresOniricos.p-1")}
                        </p>
                        <br />
                        <p>
                            {t("creadoresOniricos.p-2")}
                        </p>
                    </div>
                    <div data-aos="fade-down" className="col-span-6 sm:col-span-12 lg:col-span-6 md:block hidden">
                        <center>
                            <img src={logo} className="glow-gold lg:w-100 w-50 float" alt="" />
                        </center>
                    </div>
                </div>
            </section>
            <section className="bg-black/50 md:px-20 px-5 pb-8 py-20" id="biography">
                <div className="wrapper">
                    <div data-aos="fade-up" className="landing-image lg:max-h-[80vh] max-h-50 float">
                        <div className="img-duotoner glow-gold ">
                            <img src={omar} />
                        </div>
                    </div>
                    <div data-aos="fade-down" className="mt-10 md:mt-0 ">
                        <h1 className="text-gold lg:text-8xl text-4xl font-romance mb-10">Elías Varela</h1>
                        <div className="space-y-5 font-liberation text-justify md:w-150 w-full text-base md:text-xl">
                            <p>
                                {t("bioOmar.p-1")}
                            </p>
                            <p>
                                {t("bioOmar.p-2")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 mt-20">
                <article className="grid grid-cols-12 md:gap-10 place-items-center md:space-y-0 space-y-10">
                    <div data-aos="fade-up" className="col-span-12 md:col-span-6">
                        <CardHover firstText={t("mission.p-1")} secondText={t("mission.p-2")} title={t("mission.title")} img={astroMision} />
                    </div>
                    <div data-aos="fade-down" className="col-span-12 md:col-span-6">
                        <CardHover firstText={t("vision.p-1")} secondText={t("vision.p-2")} title={t("vision.title")} img={astroVision} />
                    </div>
                </article>

                <article className="mt-20 text-base">
                    <h1 data-aos="fade" className=" font-romance text-gold  lg:text-7xl text-4xl">{t("philosophy.title")}</h1>
                    <p data-aos="fade" className="text-justify font-liberation md:text-2xl mt-10 md:w-3/4">{t("philosophy.p-1")}</p>
                    <div className="grid grid-cols-12 gap-4">
                        <div data-aos="fade-up" className="col-span-12 md:col-span-8 mt-8 font-liberation md:text-xl  p-5 bg-black/50 rounded-2xl border-2 border-[#f2cc8a]">
                            <h5 className="text-2xl text-gold font-times">{t("philosophy.points.subtitle")}:</h5>
                            <ul className="space-y-5 mt-4 ps-5 text-justify">
                                <li>{t("philosophy.points.1")}</li>
                                <li>{t("philosophy.points.2")}</li>
                                <li>{t("philosophy.points.3")}</li>
                                <li>{t("philosophy.points.4")}</li>
                                <li>{t("philosophy.points.5")}</li>
                            </ul>
                        </div>
                        <div data-aos="fade-down" className="col-span-12 mt-10 md:mt-0 md:col-span-4 flex flex-col justify-center  text-justify md:text-xl font-liberation">
                            {t("philosophy.p-2")}
                        </div>
                    </div>
                </article>
            </section>


            <Footer />
        </>
    );
}