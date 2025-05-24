import { useTranslation } from "react-i18next";
import useFavStore from "@/hooks/useFavStore";
import { Star } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import { useMemo } from "react";
import FavStop from "./FavStop";
import Alert from "@/ui/Alert";
import { Location } from "typings";

export default () => {
    const favorites = useFavStore((state) => state.favorites);
    const { t } = useTranslation("Favorites");

    const sortedFavorites = useMemo(() => {
        const useSorting = localStorage.getItem("useLocationSorting") === "true";
        if (!useSorting) return favorites;

        const userLocation = JSON.parse(localStorage.getItem("userLocation") || "null");
        if (!userLocation || userLocation.lastUpdate < Date.now() - 60000 * 5) return favorites;

        return [...favorites].sort((a, b) => {
            const distanceA = calculateDistance(userLocation.location, a.location);
            const distanceB = calculateDistance(userLocation.location, b.location);

            return distanceA - distanceB;
        });
    }, [favorites]);

    if (!sortedFavorites.length) {
        return <Alert Icon={Star} title={t("addStopsHere")} description={t("howToAddStopsHere")} />;
    }

    return (
        <Virtuoso
            style={{ height: "calc(var(--rsbs-overlay-h) - 55px)" }}
            data={sortedFavorites}
            itemContent={(index, stop) => <FavStop key={`favStop${index}`} index={index} stop={stop} />}
        />
    );
};

const calculateDistance = (loc1: Location, loc2: Location) => {
    const [lng1, lat1] = loc1;
    const [lng2, lat2] = loc2;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        0.5 -
        Math.cos(dLat) / 2 +
        (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLng))) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
};
