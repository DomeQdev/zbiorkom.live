import { useLocation } from "react-router-dom";

export default () => {
    const { pathname } = useLocation();

    if (pathname.includes("favoriteStops")) return "FavoriteStops";
    else if (pathname.includes("filter")) return "Filter";
    else if (pathname.includes("route/")) return "Route";
    else if (pathname.includes("station/")) return "Station";
    else if (pathname.includes("stop/")) return "Stop";
    else if (pathname.includes("vehicle/")) return "Vehicle";
    else if (pathname.includes("trip/")) return "Trip";
    else return null;
};
