import {useEffect} from "react";

export function useWindowResizeEvent(resizeCallback) {
    useEffect(() => {
        window.addEventListener("resize", resizeCallback);
        return () => {
            window.removeEventListener("resize", resizeCallback);
        }
    }, []);
}

