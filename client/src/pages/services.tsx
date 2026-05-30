import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useEffect, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { services } from "@/data/services";
import ButtonGlow from "@/components/buttons/button.glow";
import { useLocation, useNavigate } from "react-router";
import Footer from "@/components/footer/footer";
import { useIsMobile } from "@/hooks/use-mobile";
import i18n from "@/config/i18n";
import WaButton from "@/components/buttons/waButton/waButton";

export default function Services() {
    const { loading, startLoading, stopLoading } = usePageLoader();

    const style = {
        '--dur': `${(Math.random() * 1.5 + 2.5).toFixed(2)}}s`,
        '--delay': `${(Math.random() * -3).toFixed(2)}s`,
    } as CSSProperties;

    const location = useLocation();
    const lang = i18n.language;

    const { t } = useTranslation("translation", { keyPrefix: "services" });

    const navigate = useNavigate();

    const isMobile = useIsMobile();


    const [loadingLanguaje, setLoadingLanguaje] = useState(false);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);

    const handleScroll = () => {
        window.scrollBy({
            top: 700,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (location.pathname === '/services') document.title = lang === 'en' ? 'Services' : 'Servicios';
    }, [location.pathname, lang]);

    useEffect(() => {
        const id = (location.state as { scrollTo?: string })?.scrollTo;

        if (!id) return;

        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth" });
    }, [location]);



    useEffect(() => {
        startLoading();

        const timer = setTimeout(() => stopLoading(), 500);
        return () => {
            clearTimeout(timer);
        };
    }, [startLoading, stopLoading]);

    return (
        <>
            <NavBar />
            <WaButton />
            <Loader isVisible={loading || loadingLanguaje} />

            <section className="text-center min-h-dvh md:pt-10 bg-black/50 w-full space-y-20 px-4">
                <h1 className=" font-romance text-base text-center md:text-7xl text-4xl pt-30">{t("title")}</h1>
                <p style={style} className="text-center font-times glow-gold  float  md:text-4xl text-2xl w-full md:px-0 px-4">{t("p-1")}</p>
                <p className="text-center font-times glow-gold  float  mb-10 md:text-4xl text-2xl w-full md:px-0 px-4">{t("p-2")}</p>
                <ButtonGlow onClick={handleScroll}>{t("readServices")}</ButtonGlow>
            </section>

            <section className="mx-auto max-w-7xl px-4">
                <article className="grid grid-cols-12 gap-4 mt-20">
                    {
                        Object.keys(services).map((key, idx) => (
                            idx % 2 === 0 ?
                                <>
                                    <div data-aos="fade-up" className="md:col-span-4 col-span-12">
                                        <h2 className="font-romance text-gold text-center  md:text-6xl text-5xl">{t(services[key].title)}</h2>
                                        <center>
                                            <img src={services[key].frame} className="md:w-100 w-50  glow-gold" alt={services[key].title} />
                                        </center>
                                    </div>
                                    <div data-aos="fade-down" className="md:col-span-8 col-span-12 h-full w-full flex flex-col justify-center items-center ">
                                        <p className="md:text-3xl text-xl  font-times text-base mb-4 text-justify">{t(services[key].description)}</p>
                                        <ButtonGlow onClick={() => navigate(services[key].url)}>{t("readMore")}</ButtonGlow>
                                    </div>
                                </>
                                :
                                <>
                                    <div data-aos="fade-up" className={`col-span-12 ${isMobile ? "block" : "hidden"}`}>
                                        <h2 className="font-romance text-gold text-center  md:text-6xl text-5xl">{t(services[key].title)}</h2>
                                        <center>
                                            <img src={services[key].frame} className="md:w-100 w-50  glow-gold" alt={services[key].title} />
                                        </center>
                                    </div>
                                    <div data-aos="fade-down" className="md:col-span-8 col-span-12 h-full w-full flex flex-col justify-center items-center ">
                                        <p className="md:text-3xl text-xl text-justify font-times text-base mb-4">{t(services[key].description)}</p>
                                        <ButtonGlow onClick={() => navigate(services[key].url)}>{t("readMore")}</ButtonGlow>
                                    </div>
                                    <div data-aos="fade-up" className={`col-span-4 ${isMobile ? "hidden" : "block"}`}>
                                        <h2 className="font-romance text-gold text-center  md:text-6xl text-5xl">{t(services[key].title)}</h2>
                                        <center>
                                            <img src={services[key].frame} className="md:w-100 w-50  glow-gold" alt={services[key].title} />
                                        </center>
                                    </div>
                                </>
                        ))
                    }
                </article>

                <article className="mt-20">
                    <div data-aos="fade" className="bg-black/50 rounded-2xl p-10 border-2 border-[#f2cc8a]">
                        <h2 className="font-romance md:text-6xl text-3xl text-gold">Aurora Onirica</h2>
                        <h2 className="font-times md:text-6xl text-3xl text-gold">{t("itsForYou")}:</h2>

                        <ul className="text-base space-y-5  md:text-2xl text-sm mt-10 font-liberation">
                            <li>{t("point-1")}</li>
                            <li>{t("point-2")}</li>
                            <li>{t("point-3")}</li>
                            <li>{t("point-4")}</li>
                            <li>{t("point-5")}</li>
                            <li>{t("point-6")}</li>
                            <li>{t("point-7")}</li>
                        </ul>
                        <div className="text-center mt-10 text-base text-2xl opacity-60 font-times">
                            {t("price")}
                        </div>
                    </div>
                </article>
            </section>

            <Footer />
        </>

    );
}