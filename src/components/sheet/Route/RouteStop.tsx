import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ETripStop, TripStop } from "typings";
import { useMap } from "react-map-gl";

type Props = {
    stop: TripStop;
    color: string;
    index: number;
};

export default ({ stop, color, index }: Props) => {
    const { current: map } = useMap();

    return (
        <ListItemButton
            onClick={() =>
                map?.flyTo({
                    center: stop[ETripStop.location],
                    zoom: map.getZoom() > 15 ? map.getZoom() : 15,
                })
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
