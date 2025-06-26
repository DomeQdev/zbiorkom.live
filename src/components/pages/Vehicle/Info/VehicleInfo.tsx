import { memo } from "react";
import { EVehicleInfo, VehicleInfo } from "typings";
import { Box, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    Accessible,
    AcUnit,
    BusinessOutlined,
    CalendarMonth,
    Commute,
    Garage,
    ReadMore,
} from "@mui/icons-material";

export default memo(({ vehicle }: { vehicle: VehicleInfo }) => {
    const { t } = useTranslation("VehicleInfo");

    return (
        <Box
            sx={{
                margin: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                "& > :first-of-type": {
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                },
                "& > :last-of-type": {
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                },
            }}
        >
            <VehicleInformation title={t("model")} icon={<Commute />} text={vehicle[EVehicleInfo.model]} />
            {vehicle[EVehicleInfo.depot] && (
                <VehicleInformation title={t("depot")} icon={<Garage />} text={vehicle[EVehicleInfo.depot]} />
            )}
            {vehicle[EVehicleInfo.carrier] && (
                <VehicleInformation
                    title={t("carrier")}
                    icon={<BusinessOutlined />}
                    text={vehicle[EVehicleInfo.carrier]}
                />
            )}
            {vehicle[EVehicleInfo.prodYear] && (
                <VehicleInformation
                    title={t("prodYear")}
                    icon={<CalendarMonth />}
                    text={vehicle[EVehicleInfo.prodYear]}
                />
            )}
        </Box>
    );
});

const VehicleInformation = ({ title, icon, text }: { title: string; icon: JSX.Element; text?: string }) => (
    <ListItem
        sx={{
            py: 0,
            backgroundColor: "background.paper",
            color: "hsla(0, 0%, 100%, 0.9)",
            minHeight: 56,
        }}
    >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} secondary={text} />
    </ListItem>
);
