import { useQueryRouteGraph } from "@/hooks/useQueryRoutes";
import { useParams } from "react-router-dom";
import { getCityFromUrl } from "@/util/tools";
import Schedule from "./Schedule";

export default () => {
    const { city, route, brigade } = useParams();
    const routeCity = getCityFromUrl(city);
    const { data: routeInfo } = useQueryRouteGraph({ city: routeCity, route: route! });

    return <Schedule city={routeCity} route={routeInfo?.route} brigade={brigade} />;
};
