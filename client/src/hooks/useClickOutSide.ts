import { useEffect, type RefObject } from "react";

export function useClickOutSide(refs: RefObject<HTMLElement | null>[], handler: (e?: Event) => void) {
    useEffect(() => {
        const listener = (e: Event) => {
            const target = e.target as Node;

            if (!(target instanceof Node)) return;

            const clickedInSide = refs.some((ref) => ref.current && ref.current.contains(target));

            if (!clickedInSide) handler(e);
        };
        document.addEventListener("mousedown", listener);

        return () => document.removeEventListener("mousedown", listener);
    }, [refs, handler]);

}