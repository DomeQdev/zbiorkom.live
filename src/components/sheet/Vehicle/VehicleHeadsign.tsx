import { Route } from "typings";
import RouteTag from "@/map/RouteTag";

type Props = {
    route: Route;
    shortName?: string;
    headsign?: string;
    brigade?: string;
    fontSize?: string;
    onClick?: () => void;
};

export default ({ route, shortName, headsign, brigade, fontSize, onClick }: Props) => {
    return (
        <div
            style={{
                fontSize,

                cursor: onClick ? "pointer" : "default",
            }}
            className="vehicleHeader"
            onClick={onClick}
        >
            <RouteTag
                route={route}
                shortName={shortName}
                brigade={localStorage.getItem("brigade") === "true" ? brigade : undefined}
            />
            {headsign}
        </div>
    );
};
