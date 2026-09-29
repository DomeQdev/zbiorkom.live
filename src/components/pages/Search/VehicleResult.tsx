import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import { ListItemButton, ListItemText } from "@mui/material";
import { ESearchVehicle, SearchItem } from "typings";
import { Link } from "react-router-dom";
import { parseVehicleId } from "@/util/tools";

type Props = {
    vehicle: NonNullable<SearchItem["vehicle"]>;
    borderTop?: boolean;
    borderBottom?: boolean;
};

export default ({ vehicle, borderTop, borderBottom }: Props) => {
    const { vehicleNumber } = parseVehicleId(vehicle[ESearchVehicle.id]);
    const showVehicleNumber = !vehicleNumber.startsWith("_");
    const model = vehicle[ESearchVehicle.model];
    const secondary = [showVehicleNumber ? `#${vehicleNumber}` : null, model || null]
        .filter(Boolean)
        .join(", ");

    return (
        <ListItemButton
            component={Link}
            to={`../vehicle/${encodeURIComponent(vehicle[ESearchVehicle.id])}`}
            state={-2}
            sx={{
                mx: 1,
                borderRadius: 0.4,
                backgroundColor: "background.paper",
                borderTopLeftRadius: borderTop ? 16 : undefined,
                borderTopRightRadius: borderTop ? 16 : undefined,
                borderBottomLeftRadius: borderBottom ? 16 : undefined,
                borderBottomRightRadius: borderBottom ? 16 : undefined,
                "&:hover": {
                    backgroundColor: "background.paper",
                },
            }}
        >
            <ListItemText
                primary={
                    <VehicleHeadsign
                        route={vehicle[ESearchVehicle.route]}
                        headsign={vehicle[ESearchVehicle.headsign]}
                        brigade={vehicle[ESearchVehicle.brigade]}
                        fontSize="0.92em"
                    />
                }
                secondary={secondary || undefined}
                secondaryTypographyProps={{
                    fontSize: "0.8em",
                    mt: 0.3,
                }}
            />
        </ListItemButton>
    );
};
