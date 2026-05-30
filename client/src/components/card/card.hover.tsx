import type { CSSProperties } from "react";
import "./css/card.hover.css";
import { useIsMobile } from "@/hooks/use-mobile";
import i18n from "@/config/i18n";

interface Props {
    title: string;
    img: string;
    firstText: string;
    secondText: string;
}

export default function CardHover({ title, img, firstText, secondText }: Props) {
    const style = {
        '--dur': `${(Math.random() * 1.5 + 2.5).toFixed(2)}}s`,
        '--delay': `${(Math.random() * -3).toFixed(2)}s`,
        backgroundImage: `url(${img})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    } as CSSProperties;

    const isMobile = useIsMobile();

    return (
        <div className="card-hover spring-fever float md:w-[350px] h-[500px] w-80 " style={style} >
            <div className="title-content">
                <h3>{title}</h3>
                <hr />
                <div className="intro">{firstText}</div>
                {
                    isMobile && (
                        <div className="text-sm opacity-40 my-2">
                            {i18n.language === "es" ? "Click para leer más" : "Click to read more"}
                        </div>
                    )
                }
            </div>
            <div className="card-info text-sm md:text-[16px]">
                {secondText}
            </div>
            <div className="gradient-overlay"></div>
            <div className="color-overlay"></div>
        </ div>
    );
}