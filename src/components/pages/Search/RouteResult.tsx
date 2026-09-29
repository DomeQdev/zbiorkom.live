import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import { ListItemButton, ListItemText } from "@mui/material";
import { ERoute, SearchItem } from "typings";
import { Link, useParams } from "react-router-dom";
import { buildCitySuffix } from "@/util/tools";

type Props = {
    route: NonNullable<SearchItem["route"]>;
    borderTop?: boolean;
    borderBottom?: boolean;
};

export default ({ route, borderTop, borderBottom }: Props) => {
    const { city: routeCity } = useParams();

    return (
        <ListItemButton
            component={Link}
            to={`../route/${route[ERoute.id]}` + buildCitySuffix(route[ERoute.city], routeCity)}
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
