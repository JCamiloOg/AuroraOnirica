import { useEffect, useRef, useState } from "react";
import "./sectionSocial.css";
import gsap from "gsap";
import SplitType from "split-type";
import { CustomEase } from "gsap/all";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faInstagram, faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons";

gsap.registerPlugin(CustomEase);

CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
CustomEase.create("blurEase", "0.25, 0.1, 0.25, 1");
CustomEase.create("counterEase", "0.16, 1, 0.3, 1");
CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");


export default function SectionSocial() {
    const rowsRef = useRef<HTMLDivElement[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    function saveRowRef(el: HTMLDivElement | null, index: number) {
        if (el) rowsRef.current[index] = el;
    }

    const openLink = (url: string) => {
        window.open(url, "_blank");
    };


    useEffect(() => {
        const rows = rowsRef.current;

        gsap.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "customEase",
        });

        rows.forEach((row, rowIndex) => {
            const hex = row.querySelector(".color-hex");
            const number = row.querySelector(".color-number");
            const name = row.querySelector(".color-name");
            const expandedName = row.querySelector(".expanded-color-name") as HTMLElement;

            new SplitType(expandedName, { types: "chars" });

            gsap.to(hex, {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.4,
                delay: 0.1 + rowIndex * 0.08,
                ease: "gentleIn",
            });

            gsap.to(number, {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.4,
                delay: 0.2 + rowIndex * 0.08,
                ease: "gentleIn",
            });

            gsap.to(name, {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.4,
                delay: 0.3 + rowIndex * 0.08,
                ease: "gentleIn",
            });
        });
    }, []);


    function expandRow(index: number) {
        const row = rowsRef.current[index];
        const allRows = rowsRef.current;

        const expanded = row.querySelector(".expanded-content") as HTMLElement;
        const content = row.querySelector(".color-content") as HTMLElement;

        expanded.style.display = "flex";
        content.style.display = "none";

        gsap.to(row, {
            flex: 8,
            duration: 0.4,
            ease: "counterEase",
        });

        const chars = row.querySelectorAll(".expanded-color-name .char");
        gsap.fromTo(
            chars,
            { opacity: 0, filter: "blur(15px)" },
            {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.5,
                stagger: 0.02,
                ease: "customEase",
            }
        );

        const details = row.querySelectorAll(".expanded-details div");
        gsap.to(details, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.4,
            stagger: 0.1,
            ease: "blurEase",
        });

        allRows.forEach((other, i) => {
            if (i !== index) {
                gsap.to(other, {
                    flex: 0.5,
                    duration: 0.4,
                    ease: "counterEase",
                });
            }
        });
    }

    function closeRow(index: number) {
        const row = rowsRef.current[index];
        const expanded = row.querySelector(".expanded-content") as HTMLElement;
        const content = row.querySelector(".color-content") as HTMLElement;

        expanded.style.display = "none";
        content.style.display = "flex";

        const allRows = rowsRef.current;
        allRows.forEach((r) => {
            gsap.to(r, {
                flex: 1,
                duration: 0.4,
                ease: "counterEase",
            });
        });

        const details = expanded.querySelectorAll(".expanded-details div");
        gsap.set(details, { opacity: 0, filter: "blur(10px)" });
    }

    function handleRowClick(index: number) {
        if (activeIndex === index) {
            closeRow(index);
            setActiveIndex(null);
            return;
        }

        if (activeIndex !== null) closeRow(activeIndex);

        expandRow(index);
        setActiveIndex(index);
    }

    function copy(text: string) {
        navigator.clipboard.writeText(text);
        const notification = document.querySelector(".copy-notification") as HTMLElement;

        gsap.to(notification, {
            opacity: 1,
            duration: 0.2,
            ease: "gentleIn",
            onComplete: () => {
                gsap.to(notification, {
                    opacity: 0,
                    delay: 0.8,
                    duration: 0.2,
                    ease: "blurEase",
                });
            },
        });
    }
    return (
        <>
            <div className="color-container">
                <div onClick={() => handleRowClick(0)} ref={(el) => saveRowRef(el, 0)} className="color-row color-1 light-text pointer-events-none">
                    <div className="color-content" >
                        <div className="color-hex hidden xl:block" onClick={(e) => { e.stopPropagation(); copy("#0A0A0A"); }}></div>
                        <div className="color-number"></div>
                        <div className="color-name hidden xl:block"></div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name"></div>
                            <div className="expanded-details">
                                <div className="detail-number"></div>
                                <div className="detail-hex" onClick={(e) => { e.stopPropagation(); copy("#0A0A0A"); }}></div>
                                <div className="detail-oklch" onClick={(e) => { e.stopPropagation(); copy("hsl(12%, 0%, 0%)"); }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleRowClick(1)} ref={(el) => saveRowRef(el, 1)} className="color-row bg-[#075e54] light-text">
                    <div className="color-content">
                        <div onClick={(e) => { e.stopPropagation(); openLink("https://wa.link/wtqkic"); }} className="color-hex block font-times">{t("socialNetworks.goToLink")}</div>
                        <div className="color-number hidden md:block font-romance">WhatsApp</div>
                        <div className="color-name "><FontAwesomeIcon icon={faWhatsapp} size="4x" /></div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name font-romance">
                                <FontAwesomeIcon icon={faWhatsapp} />
                                <h2>WhatsApp</h2>
                            </div>
                            <div className="expanded-details">
                                {/* <div className="detail-number"></div> */}
                                <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="detail-hex font-times">{t("socialNetworks.copyLink")}</div>
                                <div onClick={(e) => { e.stopPropagation(); openLink("https://wa.link/wtqkic"); }} className="detail-oklch font-times">{t("socialNetworks.goToLink")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleRowClick(2)} ref={(el) => saveRowRef(el, 2)} className="color-row bg-[#cf2872] light-text">
                    <div className="color-content">
                        <div onClick={(e) => { e.stopPropagation(); openLink("https://www.instagram.com/creadoresoniricos/"); }} className="color-hex block font-times">{t("socialNetworks.goToLink")}</div>
                        <div className="color-number hidden md:block font-romance">Instagram</div>
                        <div className="color-name">
                            <FontAwesomeIcon icon={faInstagram} size="4x" />
                        </div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name font-romance">
                                <FontAwesomeIcon icon={faInstagram} />
                                <h2>Instagram</h2>
                            </div>
                            <div className="expanded-details">
                                <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="detail-hex font-times">{t("socialNetworks.copyLink")}</div>
                                <div onClick={(e) => { e.stopPropagation(); openLink("https://www.instagram.com/creadoresoniricos/"); }} className="detail-oklch font-times">{t("socialNetworks.goToLink")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleRowClick(3)} ref={(el) => saveRowRef(el, 3)} className="color-row bg-[#1773ea] light-text">
                    <div className="color-content">
                        <div onClick={(e) => { e.stopPropagation(); openLink("https://www.facebook.com/profile.php?id=61573516347045"); }} className="color-hex block font-times">{t("socialNetworks.goToLink")}</div>
                        <div className="color-number hidden md:block font-romance">Facebook</div>
                        <div className="color-name">
                            <FontAwesomeIcon icon={faFacebook} size="4x" />
                        </div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name font-romance">
                                <FontAwesomeIcon icon={faFacebook} />
                                <h2>Facebook</h2>
                            </div>
                            <div className="expanded-details">
                                {/* <div className="detail-number"></div> */}
                                <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="detail-hex font-times">{t("socialNetworks.copyLink")}</div>
                                <div onClick={(e) => { e.stopPropagation(); openLink("https://www.facebook.com/profile.php?id=61573516347045"); }} className="detail-oklch font-times">{t("socialNetworks.goToLink")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div onClick={() => handleRowClick(4)} ref={(el) => saveRowRef(el, 4)} className="color-row bg-[#040404] light-text">
                    <div className="color-content">
                        <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="color-hex block font-times">{t("socialNetworks.copyLink")}</div>
                        <div className="color-number hidden md:block font-romance">Tik tok</div>
                        <div className="color-name">
                            <FontAwesomeIcon icon={faTiktok} size="4x" />
                        </div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name font-romance">
                                <FontAwesomeIcon icon={faTiktok} />
                                <h2>Tik tok</h2>
                            </div>
                            <div className="expanded-details">
                                <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="detail-hex font-times">{t("socialNetworks.copyLink")}</div>
                                <div onClick={(e) => { e.stopPropagation(); }} className="detail-oklch font-times">{t("socialNetworks.goToLink")}</div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div onClick={() => handleRowClick(5)} ref={(el) => saveRowRef(el, 5)} className="color-row bg-[#ee0f0f] light-text">
                    <div className="color-content">
                        <div onClick={(e) => { e.stopPropagation(); openLink("https://youtube.com/@creadoresoniricos"); }} className="color-hex block font-times">{t("socialNetworks.goToLink")}</div>
                        <div className="color-number hidden md:block font-romance">Youtube</div>
                        <div className="color-name">
                            <FontAwesomeIcon icon={faYoutube} size="4x" />
                        </div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name font-romance">
                                <FontAwesomeIcon icon={faYoutube} />
                                <h2>Youtube</h2>
                            </div>
                            <div className="expanded-details">
                                {/* <div className="detail-number">C - [05]</div> */}
                                <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="detail-hex font-times">{t("socialNetworks.copyLink")}</div>
                                <div onClick={(e) => { e.stopPropagation(); openLink("https://youtube.com/@creadoresoniricos"); }} className="detail-oklch font-times">{t("socialNetworks.goToLink")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div onClick={() => handleRowClick(6)} ref={(el) => saveRowRef(el, 6)} className="color-row bg-[#1db954] light-text">
                    <div className="color-content">
                        <div onClick={(e) => { e.stopPropagation(); openLink("https://open.spotify.com/user/31rnsqm62s2cdlv4fdvtcbv3l24u?si=TZIgjkMBTr-ZsqqIFt1ufg"); }} className="color-hex block font-times">{t("socialNetworks.goToLink")}</div>
                        <div className="color-number hidden md:block font-romance">Spotify</div>
                        <div className="color-name">
                            <FontAwesomeIcon icon={faSpotify} size="4x" />
                        </div>
                    </div>
                    <div className="expanded-content light-text">
                        <div className="expanded-color-info">
                            <div className="expanded-color-name font-romance">
                                <FontAwesomeIcon icon={faSpotify} />
                                <h2>Spotify</h2>
                            </div>
                            <div className="expanded-details">
                                <div onClick={(e) => { e.stopPropagation(); copy(""); }} className="detail-hex font-times">{t("socialNetworks.copyLink")}</div>
                                <div onClick={(e) => { e.stopPropagation(); openLink("https://open.spotify.com/user/31rnsqm62s2cdlv4fdvtcbv3l24u?si=TZIgjkMBTr-ZsqqIFt1ufg"); }} className="detail-oklch font-times">{t("socialNetworks.goToLink")}</div>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
            <div className="copy-notification">{t("socialNetworks.copied")}</div>
        </>
    );
} 