import { ArrowUpward } from "@mui/icons-material";
import Icon from "@/ui/Icon";
import { Marker } from "@vis.gl/react-maplibre";
import { ERoute, EVehicle, Vehicle } from "typings";
import { useChristmasStore } from "@/hooks/useChristmasVehicles";
import { VehicleSnow } from "@/ui/ChristmasDecorations";

type Props = {
    vehicle: Vehicle;
    showBrigade: boolean;
    showFleet: boolean;
    onClick?: () => void;
};

export default ({ vehicle, showBrigade, showFleet, onClick }: Props) => {
    // const showBrigade = localStorage.getItem("brigade") === "true";
    // const showFleet = localStorage.getItem("fleet") === "true";
    const fleetId = vehicle[EVehicle.id].split("/")[1];
    const isChristmasVehicle = useChristmasStore((state) => state.isChristmasVehicle(vehicle[EVehicle.id]));

    return (
        <Marker
            longitude={vehicle[EVehicle.location][0]}
            latitude={vehicle[EVehicle.location][1]}
            style={{ zIndex: isChristmasVehicle ? 5 : 3 }}
            onClick={onClick}
        >
            <div
                className={`vehicle marker ${isChristmasVehicle ? "christmas-vehicle" : ""}`}
                style={{
                    background: vehicle[EVehicle.route][ERoute.color],
                    position: "relative",
                    overflow: "visible",
                    transform: isChristmasVehicle ? "scale(1.07)" : undefined,
                }}
            >
                {/* Śnieg na pojeździe */}
                {isChristmasVehicle && <VehicleSnow />}
                {/* {vehicle.emoji && (
                    <span
                        className="emoji"
                        style={{ background: vehicle.background || vehicle.route.color }}
                        dangerouslySetInnerHTML={{
                            __html: vehicle.emoji,
                        }}
                    />
                )} */}

                {vehicle[EVehicle.bearing] !== null && (
                    <ArrowUpward
                        sx={{
                            transition: "transform 0.5s",
                        }}
                        style={{
                            transform: `rotate(${vehicle[EVehicle.bearing]}deg)`,
                        }}
                    />
                )}
                <svg viewBox="0 0 24 24" width="1em" fill="currentColor">
                    <Icon
                        type={vehicle[EVehicle.route][ERoute.type]}
                        agency={vehicle[EVehicle.route][ERoute.agency]}
                    />
                </svg>
                <b>{vehicle[EVehicle.route][ERoute.name]}</b>
                <span>
                    {showBrigade && vehicle[EVehicle.brigade] ? `/${vehicle[EVehicle.brigade]}` : ""}
                    {showFleet && !fleetId.startsWith("_") ? `/${fleetId}` : ""}
                </span>
            </div>
        </Marker>
    );
};
