import { useMap } from "react-map-gl";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default () => {
    const { key, state } = useLocation();
    const { current: map } = useMap();
    const navigate = useNavigate();
    const { city } = useParams();

    const currentHistory = window.history.length - window.historyLength;

    return ({ ignoreState = false }: { ignoreState?: boolean } = {}) => {
        if (!key || key === "default" || (Math.abs(state) > currentHistory && !ignoreState)) {
            navigate(`/${city}/`);

            if (map && map.getZoom() < 15) map.flyTo({ zoom: 15 });
        } else {
            navigate(ignoreState ? -1 : state || -1);
        }
    };
};
