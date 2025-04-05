import { MutableRefObject, useEffect, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock-upgrade";

type Props = {
    scrollContainer: MutableRefObject<HTMLDivElement | null>;
    element: MutableRefObject<HTMLDivElement | null>;
    offset?: number;
    children?: (percent: number) => JSX.Element;
};

export default ({ scrollContainer, element, offset, children }: Props) => {
    const [percent, setPercent] = useState(0);

    const getPercent = () => {
        const container = scrollContainer.current;
        const el = element.current;

        if (!container || !el) return 0;

        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const visiblePartOfEl =
            Math.min(containerRect.bottom, elRect.bottom) - Math.max(containerRect.top, elRect.top);

        return 1 - Math.max(0, visiblePartOfEl / elRect.height);
    };

    const handleScroll = () => setPercent(getPercent());

    const handleScrollEnd = () => {
        const percent = getPercent();

        if (percent === 1 || percent === 0) return;

        const container = scrollContainer.current;
        const el = element.current;

        if (!container || !el) return;

        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) return;

        if (percent > 0.4) {
            container.scrollTo({
                top: el.offsetHeight + (offset || 0),
                behavior: "smooth",
            });
        } else {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(() => {
        const current = scrollContainer.current;

        if (current) {
            disableBodyScroll(current);

            current.addEventListener("scroll", handleScroll);
            current.addEventListener("scrollend", handleScrollEnd);
        }

        return () => {
            if (current) {
                enableBodyScroll(current);

                current.removeEventListener("scroll", handleScroll);
                current.removeEventListener("scrollend", handleScrollEnd);
            }
        };
    }, [scrollContainer, element]);

    return children?.(percent);
};
