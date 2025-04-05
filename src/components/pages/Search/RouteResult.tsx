import VehicleHeadsign from "@/sheet/Vehicle/VehicleHeadsign";
import { ListItemButton, ListItemText } from "@mui/material";
import { ERoute, SearchItem } from "typings";
import { Link } from "react-router-dom";

type Props = {
    route: NonNullable<SearchItem["route"]>;
    borderTop?: boolean;
    borderBottom?: boolean;
};

export default ({ route, borderTop, borderBottom }: Props) => {
    return (
        <ListItemButton
            component={Link}
            to={`../route/${route[ERoute.id]}`}
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
                    <VehicleHeadsign route={route} headsign={route[ERoute.longName]} fontSize="0.92em" />
                }
            />
        </ListItemButton>
    );
};
