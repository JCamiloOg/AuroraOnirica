import type { CSSProperties } from "react";
import "./css/card.image.css";

interface Props {
    title: string;
    image: string;
}

export default function CardImage({ title, image }: Props) {

    const style = {
        "--title": `"${title}"`,
        backgroundImage: `url(${image})`
    } as CSSProperties;
    return (
        <div className="thumbnail glow-gold float md:w-full w-50">
            <div className="thumbnail__container">
                <div
                    className="thumbnail__img"
                    style={style}>
                </div>
                {/* <div className="thumbnail__content">
                    <h1 className="thumbnail__caption">Caption goes here</h1>
                </div> */}
            </div>
        </div>
    );
}