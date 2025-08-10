import { useQueryRoute } from "@/hooks/useQueryRoutes";
import { ERouteInfo } from "typings";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";

export default () => {
    const { city, route, brigade } = useParams();
    const { data: routeInfo } = useQueryRoute({ city: city!, route: route! });

    return <Schedule city={city!} route={routeInfo?.[ERouteInfo.route]} brigade={brigade} />;
};
