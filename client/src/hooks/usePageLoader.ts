import { useCallback, useState } from "react";

export function usePageLoader() {
    const [loading, setLoading] = useState(true);

    const startLoading = useCallback(() => {
        setLoading(true);
        document.body.style.overflow = "hidden";
    }, []);

    const stopLoading = useCallback(() => {
        setLoading(false);
        document.body.style.overflow = "auto";
    }, []);

    return { loading, startLoading, stopLoading };

}