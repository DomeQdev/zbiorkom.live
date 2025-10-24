import VehicleHeadsign from "@/sheet/Trip/TripHeadsign";
import { ListItemButton, ListItemText } from "@mui/material";
import { ESearchRelation, SearchItem } from "typings";
import { Link } from "react-router-dom";
import { getTime } from "@/util/tools";

type Props = {
    relation: NonNullable<SearchItem["relation"]>;
    borderTop?: boolean;
    borderBottom?: boolean;
};

export default ({ relation, borderTop, borderBottom }: Props) => {
    return (
        <ListItemButton
            component={Link}
            to={`../trip/${encodeURIComponent(relation[ESearchRelation.id])}?pkp`}
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
                        route={relation[ESearchRelation.route]}
                        shortName={relation[ESearchRelation.shortName]}
                        headsign={relation[ESearchRelation.headsign]}
                        fontSize="0.92em"
                    />
                }
                secondary={[
                    new Date(relation[ESearchRelation.start]).toLocaleDateString(),
                    [getTime(relation[ESearchRelation.start]), getTime(relation[ESearchRelation.end])].join(
                        " - ",
                    ),
                ].join(", ")}
                secondaryTypographyProps={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.8em",
                    mt: 0.3,
                    gap: 0.5,
                }}
            />
        </ListItemButton>
    );
};
