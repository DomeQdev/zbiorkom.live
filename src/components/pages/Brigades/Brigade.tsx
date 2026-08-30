import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";

export default () => {
    const { city, route, brigade } = useParams();
    const { data: routeInfo } = useQueryRouteGraph({ city: city!, route: route! });

    return <Schedule city={city!} route={routeInfo?.route} brigade={brigade} />;
};
