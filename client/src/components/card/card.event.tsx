import type { GetEvents } from "@/types/events";
import "./css/card.event.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import i18n from "@/config/i18n";
import { useEffect, useRef, type CSSProperties } from "react";

interface Props {
    event: GetEvents;
    alt?: boolean;
}

export default function CardEvent({ event, alt }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const lang = i18n.language;
    const { t } = useTranslation("translation", { keyPrefix: "events" });
    const style = {
        "--dur": `${(Math.random() * 1.5 + 2.5).toFixed(2)}}s`,
        "--delay": `${(Math.random() * -3).toFixed(2)}s`,
    } as CSSProperties;

    useEffect(() => {
        const listener = (e: Event) => {
            if (!(e.target instanceof Node)) return;

            const hover = cardRef.current && cardRef.current.contains(e.target);

            if (hover) {
                cardRef.current?.classList.remove("float");
            } else {
                cardRef.current?.classList.add("float");
            };
        };
        document.addEventListener("mouseover", listener);

        return () => {
            document.removeEventListener("mouseover", listener);
        };
    });

    return (
        <>
            <div ref={cardRef} className={`blog-card md:h-58 float ${alt ? "alt" : ""}`} style={style} >
                <div className="meta">
                    <div className="photo" style={{ backgroundImage: `url(${event.image})` }}></div>
                    <ul className="details">
                        {
                            event.address && (
                                <li className="flex gap-2">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    {event.address}
                                </li>
                            )
                        }
                        <li className="flex gap-2">
                            <FontAwesomeIcon icon={faCalendarDays} />
                            {new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(event.date))}
                        </li>
                        <li className="flex gap-2">
                            <FontAwesomeIcon icon={faClock} />
                            {new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(new Date(`2006-06-02T${event.hour}`))}
                        </li>
                    </ul>
                </div>
                <div className="description">
                    <h1 title={event.title} className="font-times text-gold text-3xl md:truncate md:w-80">{event.title}</h1>
                    <h2 className="font-times text-baseYellow/70 text-xl ">{event.modality == "Presencial" ? t("modality1") : t("modality2")}</h2>
                    <p className="text-justify text-base h-20 mt-5 font-liberation text-lg  overflow-y-auto scrollMin"> {event.description}</p>
                    <p className="text-white/50 lg:hidden block font-liberation">{lang === "es" ? "Click para ver más" : "Click to see more"}</p>
                    {
                        event.inscription_link && (
                            <p className="text-right mt-3">
                                <a className="text-baseYellow hover:text-baseYellow/60 hover:underline" href={event.inscription_link} target="_blank">{t("link")}</a>
                            </p>
                        )
                    }
                </div>
            </div>
        </>
    );
}