/* Components */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "@/components/navBar/navBar";
import Loader from "@/components/loader/loader";
import Footer from "@/components/footer/footer";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import WaButton from "@/components/buttons/waButton/waButton";

/* Hooks */
import { usePageLoader } from "@/hooks/usePageLoader";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import usePagination from "@/hooks/usePaginationBlock";

/* Types */
import type { GetWords } from "@/types/glossary";

/* Services */
import { getWords } from "@/services/glossaryServices";

/* Images */
import doorIcon from "@/assets/icons/doorIcon.png";
import brainGold from "@/assets/icons/brainGold.png";
import book from "@/assets/icons/bookMagic.png";
import celestialIcons from "@/assets/icons/celestialIcons.png";
import eyeGoldIcon from "@/assets/icons/eyeGoldIcon.png";
import goldFlower from "@/assets/icons/goldFlower.png";
import eyeIcon from "@/assets/icons/eyeIcon.png";
import handleIcon from "@/assets/icons/handlesIcon.png";
import lightIcon from "@/assets/icons/lightIcon.png";


/* Config */
import i18n from "@/config/i18n";

export default function Glossary() {
    // States
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [words, setWords] = useState<GetWords[]>();
    const [totalPages, setTotalPages] = useState(0);
    const images = [doorIcon, brainGold, celestialIcons, eyeGoldIcon, goldFlower, book, eyeIcon, handleIcon, lightIcon];



    // Hooks
    const { loading, startLoading, stopLoading } = usePageLoader();
    const { t } = useTranslation("translation", { keyPrefix: "glossary" });
    const isMobile = useIsMobile();
    const isFirstLoad = useRef(true);

    // Var
    const lang = i18n.language;
    const page = parseInt(searchParams.get("page") || "1");
    const style = {
        '--dur': `${(Math.random() * 1.5 + 2.5).toFixed(2)}}s`,
        '--delay': `${(Math.random() * -3).toFixed(2)}s`,
    } as CSSProperties;
    const buttonsPagination = usePagination(totalPages, page);


    const onLoad = useCallback(async () => {
        startLoading();
        try {
            let newPage = page;

            if (newPage < 1) {
                toast.error("Invalid page number");
                newPage = 1;
                setSearchParams({ page: "1" });
            }
            const response = await getWords(newPage);

            if (response.status === 200) {
                setWords(response.data.words);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.data.message || "Error fetching articles");
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
            if (isAxiosError(error)) toast.error(error.response?.data.message || error.message);
        } finally {
            stopLoading();
        }
    }, [page, startLoading, stopLoading, setSearchParams]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            onLoad();
        } else {
            window.scrollTo({ top: 700, behavior: "instant" });
            onLoad();
        }
    }, [page, onLoad]);

    useEffect(() => {
        document.title = lang === "es" ? "Glosario" : "Glossary";
        onLoad();
    }, [t, lang, onLoad]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    return (
        <>
            <Loader isVisible={loading || loadingLanguaje} />
            <WaButton />
            <NavBar />
            <div className="bg-black/50 h-dvh">
                <h1 className="font-romance text-gold text-base text-center md:text-7xl text-4xl pt-40">{t("title")}</h1>
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 mt-10">
                    <div className="col-span-12 md:col-span-6 md:text-3xl text-base text-justify flex flex-col justify-center items-center font-liberation">
                        <p>
                            {t("paragraph")}

                        </p>
                        <FontAwesomeIcon onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })} className="mt-10 glow-gold text-baseYellow float cursor-pointer" icon={faArrowDown} size="2xl" />
                    </div>
                    <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center">
                        <img src={book} alt="" className="glow-gold float " style={style} />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-12 gap-4 mt-20 space-y-10">

                    {
                        words?.length ?
                            words.map((word, idx) => (
                                <div className="col-span-12 md:col-span-6" data-aos={isMobile ? "fade" : idx % 2 === 0 ? "fade-down" : "fade-up"}>
                                    <div className=" bg-black/60 shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 h-75 space-y-3 relative overflow-hidden">
                                        <div className="w-24 h-24 bg-[#f2cc8a] rounded-full absolute -right-5 -top-7">
                                            <p className="absolute bottom-6 left-7 text-black text-2xl">{page == 1 ? idx + 1 : ((page - 1) * 10) + idx + 1}</p>
                                        </div>
                                        <div className="fill-violet-500 md:w-20 w-15">
                                            <img src={images[Math.floor(Math.random() * images.length)]} className="glow-gold" alt={word.word} />
                                        </div>
                                        <h1 className="font-times text-gold md:text-4xl text-3xl">{word.word}</h1>
                                        <p className="md:text-xl text-lg text-base leading-6 h-30 overflow-y-auto scrollMin text-justify font-liberation">
                                            {word.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                            :
                            <>
                                <div className="col-span-12">
                                    <h1 className="font-times text-base text-center md:text-7xl">{t("noWords")}</h1>
                                </div>

                            </>
                    }
                </div>
                <div className="flex  justify-center mt-20">
                    <ButtonGroup>
                        <ButtonGroup>
                            {buttonsPagination.map((number, idx) => (
                                <Button className="bg-[#cba55f] hover:bg-[#80683c] cursor-pointer" disabled={page === number} key={idx} onClick={() => handlePageChange(number)} size="lg">{number}</Button>
                            ))}
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button className="bg-[#cba55f] hover:bg-[#80683c] cursor-pointer" disabled={page === 1} onClick={() => handlePageChange(page - 1)} size="icon-lg" aria-label="Previous">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Button>
                            <Button className="bg-[#cba55f] hover:bg-[#80683c] cursor-pointer" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)} size="icon-lg" aria-label="Next">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </ButtonGroup>
                    </ButtonGroup>
                </div>

            </div>
            <Footer />
        </>
    );
}