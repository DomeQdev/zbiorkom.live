import { AltRoute, DirectionsBus, PinDrop, Train } from "@mui/icons-material";
import { Box, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const items = [
    {
        icon: <DirectionsBus style={{ color: "#561f0f", backgroundColor: "#ffb5a0" }} />,
        title: "howToVehicles",
        description: "vehiclesDescription",
    },
    {
        icon: <PinDrop style={{ color: "#1f3701", backgroundColor: "#b1d18a" }} />,
        title: "howToStops",
        description: "stopsDescription",
    },
    {
        icon: <AltRoute style={{ color: "#0a305f", backgroundColor: "#aac7ff" }} />,
        title: "howToRoutes",
        description: "routesDescription",
    },
    {
        icon: <Train style={{ color: "#3a3000", backgroundColor: "#dbc66e" }} />,
        title: "howToRelations",
        description: "relationsDescription",
    },
    // {
    //     icon: <History style={{ color: "#3e2459", backgroundColor: "#dabaf9" }} />,
    //     title: "howToHistory",
    //     description: "historyDescription",
    // },
];

export default () => {
    const { t } = useTranslation("Search");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: 2,
                gap: 0.5,
                "& .MuiListItem-root": {
                    backgroundColor: "background.paper",
                    borderRadius: 0.75,
                    "&:first-of-type": {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                    },
                    "&:last-of-type": {
                        borderBottomLeftRadius: 24,
                        borderBottomRightRadius: 24,
                    },
                },
                "& .MuiSvgIcon-root": {
                    borderRadius: 1,
                    fontSize: 36,
                    padding: 1,
                },
            }}
        >
            <Typography variant="h5" marginBottom={2}>
                {t("howToUse")}
            </Typography>
            {items.map((item, i) => (
                <ListItem key={`searchhowto${i}`}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={t(item.title)} secondary={t(item.description)} />
                </ListItem>
            ))}
        </Box>
    );
};
