import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ETripStop, TripStop, VehicleType } from "typings";
import { useMap } from "react-map-gl";

type Props = {
    stop: TripStop;
    color: string;
    index: number;
    type: VehicleType;
};

export default ({ stop, color, index, type }: Props) => {
    const { current: map } = useMap();

    return (
        <ListItemButton
            onClick={() =>
                map?.flyTo({
                    center: stop[ETripStop.location],
                    zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                })
            }
            onDoubleClick={() =>
                navigate(
                    `/${city}/${type == 2 ? "station" : "stop"}/${stop[ETripStop.id]}`,
                    {
                        state: -2,
                    }
                )
            }
            sx={{ paddingY: 0.5 }}
        >
            <ListItemIcon>
                <span
                    className="vehicleStopIcon"
                    style={{
                        border: `3px solid ${color}`,
                    }}
                />
                {index !== 0 && (
                    <span
                        className="vehicleStopIconLine small"
                        style={{
                            backgroundColor: color,
                        }}
                    ></span>
                )}
            </ListItemIcon>
            <ListItemText
                primary={stop[ETripStop.name]}
                sx={{
                    marginLeft: "-15px",
                    "& .MuiListItemText-primary": {
                        display: "flex",
                        alignItems: "center",
                        fontSize: "15px",
                    },
                }}
            />
        </ListItemButton>
    );
};
