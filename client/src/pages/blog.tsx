/* Components */
import CardArticle from "@/components/card/card.blog";
import Footer from "@/components/footer/footer";
import Loader from "@/components/loader/loader";
import NavBar from "@/components/navBar/navBar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WaButton from "@/components/buttons/waButton/waButton";
import ButtonGlow from "@/components/buttons/button.glow";

/* Hooks */
import onChangeLanguage from "@/hooks/useChangeLanguage";
import { usePageLoader } from "@/hooks/usePageLoader";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import usePagination from "@/hooks/usePaginationBlock";

/* Types */
import type { GetArticles } from "@/types/blog";

/* Services */
import { getArticles } from "@/services/blogServices";

export default function Blog() {
    // States
    const [articles, setArticles] = useState<GetArticles[]>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loadingLanguaje, setLoadingLanguaje] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(0);

    // Hooks
    const { loading, startLoading, stopLoading } = usePageLoader();
    const { t } = useTranslation("translation", { keyPrefix: "blog" });
    const navigate = useNavigate();

    // Var
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
            const response = await getArticles(newPage);

            if (response.status === 200) {
                setArticles(response.data.articles);
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
        window.scrollTo({ top: 0, behavior: "instant" });
        onLoad();
    }, [page, onLoad]);

    useEffect(() => {
        onChangeLanguage(setLoadingLanguaje);
    }, []);

    useEffect(() => {
        document.title = "Blog";
        onLoad();
    }, [onLoad]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };



    return (
        <>
            <Loader isVisible={loading || loadingLanguaje} />
            <WaButton />
            <NavBar />
            <section className="bg">

                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="font-romance text-gold text-base text-center md:text-7xl text-4xl pt-40">BLOG</h1>
                    <div className="flex md:justify-end justify-center">
                        <ButtonGlow onClick={() => navigate("/glossary")}>{t("glossary")}</ButtonGlow>
                    </div>
                    <div className="grid grid-cols-12 md:space-y-20 space-y-40 mt-20">
                        {
                            articles?.length ?
                                articles.map((article, idx) => (
                                    <div data-aos="fade" className="col-span-12 " key={idx}>
                                        <CardArticle article={article} idx={idx} hasNext={idx < articles.length - 1} />
                                    </div>
                                )
                                )
                                :
                                <>
                                    <div className="col-span-12">
                                        <h1 className="font-times text-base text-center md:text-7xl">{t("noArticles")}</h1>
                                    </div>
                                </>
                        }
                    </div>
                </div>
                <div className="flex  justify-center mt-20">
                    {
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
                    }
                </div>
                <Footer />
            </section >
        </>
    );
}