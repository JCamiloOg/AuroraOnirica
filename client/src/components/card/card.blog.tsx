import "./css/card.blog.css";
import type { GetArticles } from "@/types/blog";
import i18n from "@/config/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

interface Props {
    article: GetArticles;
    idx: number;
    hasNext: boolean;
}

export default function CardArticle({ article, idx, hasNext }: Props) {

    const handleNext = (id: string) => {

        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* <div className="fond">
                <span className="s1">blog</span>
                <span className="s2">card</span>
            </div> */}

            <div className="card md:scroll-mt-45 scroll-mt-25" id={idx.toString()}>
                <div className="thumbnail-blog ">
                    <img
                        className="left md:w-full"
                        src={`${article.main_image}`}
                        alt=""
                    />
                </div>

                <div className="right">
                    <h1 className="text-gold font-times pt-4 text-4xl">{article.title}</h1>

                    <div className="w-fit  font-times text-baseYellow">
                        <h2>{article.subtitle}</h2>
                    </div>

                    <div className="separator"></div>

                    <p className="md:h-[250px] h-[200px] overflow-y-auto scrollMin pe-2 font-liberation text-xl!">
                        {article.text}

                    </p>
                </div>

                <h5 className="text-base font-liberation">{new Intl.DateTimeFormat(i18n.language, { day: "2-digit" }).format(new Date(article.date))}</h5>
                <h6 className="text-base font-liberation">{new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(new Date(article.date)).toUpperCase()}</h6>


                <ul>
                    <li><i className="fa fa-eye fa-2x"></i></li>
                    <li><i className="fa fa-heart-o fa-2x"></i></li>
                    <li><i className="fa fa-envelope-o fa-2x"></i></li>
                    <li><i className="fa fa-share-alt fa-2x"></i></li>
                </ul>
                {
                    hasNext && (
                        <div className="fab cursor-pointer" onClick={() => handleNext((idx + 1).toString())}>
                            <FontAwesomeIcon icon={faArrowDown} size="3x" />
                        </div>
                    )
                }
            </div>
        </>
    );
}