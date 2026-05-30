import type { CSSProperties } from "react";
import hexagon from "@/assets/hexagon.png";
import { Link } from "react-router";

interface Props {
    image: string;
    text: string;
    link?: string;
}

export default function Card({ image, text, link }: Props) {
    const style = {
        '--dur': `${(Math.random() * 1.5 + 2.5).toFixed(2)}}s`,
        '--delay': `${(Math.random() * -3).toFixed(2)}s`,
        backgroundImage: `url(${hexagon})`
    } as CSSProperties;
    return (
        <Link to={link || "/"} className="bg-center bg-cover bg-no-repeat md:w-100 transition-all duration-500 float cursor-pointer hover:scale-110 glow-white flex flex-col  items-center justify-center  text-white py-20" style={style}>
            <img src={image} className="md:w-40  w-30" alt="" />
            <div>
                <p className="font-times md:text-2xl wrap-break-word w-50 text-center">{text}</p>
            </div>
        </Link>
    );
}