import "./loader.css";
import { useEffect, useState } from "react";
interface Props {
    isVisible: boolean
}

export default function Loader({ isVisible }: Props) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            const timeOut = setTimeout(() => setHidden(true), 500);

            return () => clearTimeout(timeOut);
        } else {
            setHidden(false);
        }

    }, [isVisible]);

    if (hidden) return null;

    return (
        <div className={`w-full max-h-dvh min-h-dvh bg-[#0e0d11]/50 backdrop-blur-3xl z-100 fixed top-2/4 left-2/4 -translate-2/4 flex items-center justify-center ${isVisible ? "opacity-100" : "opacity-0"} transition-all duration-500`} >
            <div className="loader">
                <svg width={100} height={100} viewBox="0 0 100 100">
                    <defs>
                        <mask id="clipping">
                            <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                            <polygon points="25,25 75,25 50,75" fill="white" />
                            <polygon points="50,25 75,75 25,75" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                            <polygon points="35,35 65,35 50,65" fill="white" />
                        </mask>
                    </defs>
                </svg>
                <div className="box" />
            </div>
        </div>
    );
}