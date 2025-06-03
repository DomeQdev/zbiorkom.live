import { useQueryBrigade } from "@/hooks/useQueryBrigades";
import { useQueryRoute } from "@/hooks/useQueryRoutes";
import { ERouteInfo } from "typings";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";

export default () => {
    const { city, route, brigade } = useParams();

    const { data } = useQueryBrigade({ city: city!, route: route!, brigade: brigade! });
    const { data: routeInfo } = useQueryRoute({ city: city!, route: route! });

    return <Schedule route={routeInfo?.[ERouteInfo.route]} brigade={brigade!} trips={data} />;
};
