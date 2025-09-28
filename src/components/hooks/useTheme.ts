import { useMemo } from "react";
import useThemeStore from "./useThemeStore";
import getColors from "@/util/getColors";

export default () => {
    const color = useThemeStore((state) => state.color);
    const colors = useMemo(() => getColors(color), [color]);

    return colors;
};
