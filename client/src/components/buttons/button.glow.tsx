import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    onClick?: () => void;
}


export default function ButtonGlow({ children, onClick, ...rest }: Props) {
    return (
        <button onClick={() => onClick && onClick()} className="relative px-8 mt-5 cursor-pointer py-3 font-times md:text-4xl text-white transition-all duration-300 bg-transparent group" {...rest}>
            <span className="absolute inset-0 border-2 border-[#cba55f] rounded-2xl shadow-[0_0_15px_rgba(251,146,60,0.6)] group-hover:shadow-[0_0_25px_rgba(251,146,60,0.9)] transition-shadow"></span>

            <span className="relative">
                {children}
            </span>
        </button>
    );
}