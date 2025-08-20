import { ListItemButton, ListItemText } from "@mui/material";
import { EStop, SearchItem } from "typings";
import { Link } from "react-router-dom";

type Props = {
    station: NonNullable<SearchItem["station"]>;
    borderTop?: boolean;
    borderBottom?: boolean;
};

export default ({ station, borderTop, borderBottom }: Props) => {
    return (
        <ListItemButton
            component={Link}
            to={`../station/${station[EStop.id]}`}
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
            <ListItemText primary={station[EStop.name]} />
        </ListItemButton>
    );
};
