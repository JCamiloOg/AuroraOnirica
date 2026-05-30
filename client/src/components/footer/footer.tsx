import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faComputer, faGlobe, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonGlow from "../buttons/button.glow";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";

export default function Footer() {
    const { t } = useTranslation("translation", { keyPrefix: "footer" });

    const lang = i18n.language;

    return (
        <div className="w-full mt-20 md:pb-0 pb-5 relative">
            <div className="md:block hidden absolute md:bottom-2 bottom-0 left-1/2 -translate-x-1/2">
                <span className="font-romance text-gold">
                    {lang == "es" ? "Desarrollado por:" : "Powered by:"}
                </span>
                <a className="text-baseYellow font-romance underline md:no-underline hover:underline hover:text-baseYellow/50" target="_blank" href="https://instagram.com/jncamilo.dev">
                    Juan Camilo Osorio
                </a>
            </div>
            <div className="bg-black/50 grid grid-cols-12 py-4 px-10 ">
                <div className="md:col-span-4 col-span-12  ">
                    <div className="flex flex-col justify-center items-center h-full">
                        <h3 className="text-3xl text-gold font-romance">{t("contact")}</h3>
                        <a href="#" className="flex gap-1 justify-center font-liberation text-lg" ><FontAwesomeIcon className="mt-2" icon={faPhone} /> +57 3052229100</a>
                        <a href="mailto:creadoresoniricos@gmail.com" className="flex gap-1 justify-center font-liberation text-lg" target="_blank"><FontAwesomeIcon className="mt-2" icon={faEnvelope} />auroraonirica@gmail.com</a>
                        <p className="flex gap-1 justify-center font-liberation text-lg"><FontAwesomeIcon className="mt-2" icon={faGlobe} />@auroraonirica</p>
                    </div>
                </div>
                <div className="md:col-span-4 col-span-12 mt-5 md:mt-0 ">
                    <div className="flex justify-center items-center h-full">
                        <ButtonGlow >{t("schedule")}</ButtonGlow>
                    </div>
                </div>
                <div className="md:col-span-4 col-span-12 mt-5 md:mt-0 ">
                    <div className="rounded-full border-2 border-[#07161b]  py-4 px-10 bg-black/30">
                        <h5 className="font-romance text-gold text-2xl md:text-3xl text-center">{t("chars")}</h5>
                        <div className="flex gap-2 mt-5 font-liberation">
                            <FontAwesomeIcon icon={faGlobe} className="text-baseYellow md:text-xl mt-2" />
                            <p className="md:text-xl">{t("bilingual")}</p>
                        </div>
                        <div className="flex gap-2 mt-5 font-liberation">
                            <FontAwesomeIcon icon={faComputer} className="text-baseYellow md:text-xl mt-2" />
                            <p className="md:text-xl">{t("modality")}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex md:hidden  items-center justify-center">
                <span className="font-romance text-gold">
                    {lang == "es" ? "Desarrollado por:" : "Powered by:"}
                </span>
                <a className="text-baseYellow font-romance underline md:no-underline hover:underline hover:text-baseYellow/50" target="_blank" href="https://instagram.com/jncamilo.dev">
                    Juan Camilo Osorio
                </a>
            </div>
        </div >
    );
}