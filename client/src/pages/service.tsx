import ButtonGlow from "@/components/buttons/button.glow";
import WaButton from "@/components/buttons/waButton/waButton";
import Footer from "@/components/footer/footer";
import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import NotFound from "@/components/notFound/not-found";
import { services } from "@/data/services";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

interface Params extends Record<string, string> {
    service: string;
}

interface Service {
    title: string;
    description: string;
    paragraph_2: string;
    paragraph_3?: string;
    differential: string;
    url: string;
    frame: string;
    img: string
}


export default function Service() {
    const [error, setError] = useState<boolean>(false);
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);
    const { service } = useParams<Params>();
    const [serviceInfo, setServiceInfo] = useState<Service>();
    const { t } = useTranslation("translation", { keyPrefix: "services" });
    const navigate = useNavigate();



    const setService = useCallback(() => {
        startLoading();
        if (!service) return setError(true);

        setServiceInfo(services[service]);

        if (!services[service]) return setError(true);

        setTimeout(() => stopLoading(), 500);

    }, [service, startLoading, stopLoading]);


    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);

    useEffect(() => {
        if (!serviceInfo) return;
        document.title = t(serviceInfo.title);
    }, [serviceInfo, t]);


    useEffect(() => {
        setService();
    }, [setService]);

    if (error || !serviceInfo) {
        return <>
            <Loader isVisible={loading || loadingLanguaje} />
            <NotFound />
        </>;
    }
    return (
        <>
            <Loader isVisible={loading || loadingLanguaje} />
            <WaButton />
            <NavBar />
            <section className="flex flex-col items-center   bg-black/50">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className=" font-romance text-base text-center md:text-7xl text-4xl mt-40">
                        {t(serviceInfo.title).toUpperCase()}
                    </h1>
                    <div data-aos="fade-up" className="grid grid-cols-12 md:gap-10 md:mt-10">
                        <div className="md:col-span-8 col-span-12 space-y-6 md:text-2xl text-sm font-liberation p-5 text-base text-justify flex flex-col justify-center">
                            <p>
                                {t(serviceInfo.description)}
                            </p>
                            <p>
                                {t(serviceInfo.paragraph_2)}
                            </p>
                            {
                                serviceInfo.paragraph_3 &&
                                <p>
                                    {t(serviceInfo.paragraph_3)}
                                </p>
                            }
                        </div>
                        <div data-aos="fade-down" className="md:col-span-4 md:mb-0 mb-10 col-span-12 ">
                            <center>
                                <img src={serviceInfo.img} alt={t(serviceInfo.title)} className="w-50 md:w-full float rounded-2xl glow-gold" />
                            </center>
                        </div>
                        <div data-aos="fade-down" className="md:block hidden col-span-4">
                            <img src={serviceInfo.frame} alt={t(serviceInfo.title)} className="glow-gold" />
                        </div>
                        <div data-aos="fade-up" className="md:col-span-8 col-span-12 text-justify  flex flex-col justify-center ">
                            <h5 className="text-gold font-times text-4xl">{t("differential")}: </h5>
                            <p className="md:text-2xl text-lg text-base mt-5 font-liberation">{t(serviceInfo.differential)}</p>
                        </div>
                    </div>
                </div>
                <center>
                    <ButtonGlow onClick={() => navigate(-1)}>{t("goBack")}</ButtonGlow>
                </center>
                <Footer />
            </section >
        </>
    );
}