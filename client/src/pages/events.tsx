/* Components */
import WaButton from "@/components/buttons/waButton/waButton";
import CardEvent from "@/components/card/card.event";
import Footer from "@/components/footer/footer";
import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePagination from "@/hooks/usePaginationBlock";

/* Types */
import type { GetEvents } from "@/types/events";

/* Hooks */
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { getEvents } from "@/services/eventsServices";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

/* Config */
import i18n from "@/config/i18n";

export default function Events() {
    // States
    const [events, setEvents] = useState<GetEvents[]>();
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);


    // Hooks
    const { loading, startLoading, stopLoading } = usePageLoader();
    const { t } = useTranslation("translation", { keyPrefix: "events" });

    // Var
    const lang = i18n.language;
    const page = parseInt(searchParams.get("page") || "1");
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
            const response = await getEvents(newPage);

            if (response.status === 200) {
                setEvents(response.data.events);
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
        window.scrollTo({ top: 0, behavior: "instant" });
        onLoad();
    }, [page, onLoad]);

    useEffect(() => {
        document.title = lang === "en" ? "Events" : "Eventos";
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
            <div className="bg-black/50">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="font-romance text-gold text-base text-center md:text-7xl text-4xl pt-40">{t("title")}</h1>
                    <div className="grid grid-cols-12 md:space-y-5 gap-5  mt-20">
                        {
                            events?.length ?
                                events.map((event, idx) => (
                                    <div data-aos="fade" className="lg:col-span-6 col-span-12">
                                        <CardEvent event={event} alt={(idx + 1) % 2 === 0} />
                                    </div>
                                ))
                                :
                                <>
                                    <div className="col-span-12">
                                        <h1 className="font-times text-base text-center md:text-7xl">{t("noEvents")}</h1>
                                    </div>
                                </>
                        }
                    </div>
                </div >
                <div className="flex  justify-center mt-20">

                    <ButtonGroup>
                        <ButtonGroup>
                            {buttonsPagination.map((number, idx) => (
                                <Button className="bg-[#cba55f] hover:bg-[#80683c] cursor-pointer" disabled={page === number} key={idx} onClick={() => handlePageChange(number)} size="lg" >{number}</Button>
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
                <Footer />
            </div>
        </>
    );
}