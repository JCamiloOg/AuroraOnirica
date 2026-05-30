
import hexagonTop from "@/assets/hexagonGoldTop.png";

import { useIsMobile } from "@/hooks/use-mobile";
import type { CSSProperties, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string,
    image: string,
    isTop?: boolean,
    text: string,
}

export default function CardGold({ title, text, image, ...rest }: Props) {
    const breakPoint = useIsMobile(370);
    const style = {
        '--dur': `${(Math.random() * 1.5 + 2.5).toFixed(2)}}s`,
        '--delay': `${(Math.random() * -3).toFixed(2)}s`,
    } as CSSProperties;
    return (
        <div {...rest} className="relative md:h-160 h-full  flex justify-center py-20  md:px-5 transition-transform duration-1000 hover:scale-120  float " style={style} >
            <img
                src={hexagonTop}
                className="absolute inset-0 mx-auto h-full object-contain pointer-events-none glow-gold "
            />

            <div className="w-full flex flex-col items-center text-white md:px-6 z-2">
                <h5 className="text-gold font-times md:text-4xl text-2xl mt-15 glow-gold">{title}</h5>
                <img src={image} className="md:w-40  w-30 glow-gold" alt="" />
                <p className={`text-center  md:text-xl ${breakPoint ? "px-10 pb-13" : "p-6"}  md:px-0 text-sm w-80 font-liberation  `}>{text}</p>
            </div>
        </div >
    );
}