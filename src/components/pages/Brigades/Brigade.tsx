import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import useQueryBrigade from "@/hooks/useQueryBrigade";
import useQueryRoute from "@/hooks/useQueryRoute";
import { ERouteInfo } from "typings";

export default () => {
    const { city, route, brigade } = useParams();

    const { data } = useQueryBrigade({ city: city!, route: route!, brigade: brigade! });
    const { data: routeInfo } = useQueryRoute({ city: city!, route: route! });

    return <Schedule route={routeInfo?.[ERouteInfo.route]} brigade={brigade!} trips={data} />;
};
