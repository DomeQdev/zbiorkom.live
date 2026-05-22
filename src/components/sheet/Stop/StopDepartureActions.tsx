import { AltRoute, DirectionsBus } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { Box, ButtonBase } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ETrip, EVehicle, EStopDeparture, StopDeparture } from "typings";
import { buildCitySuffix, getCityFromUrl } from "@/util/tools";

export default ({ departure }: { departure: StopDeparture }) => {
    const { t } = useTranslation("Vehicle");
    const navigate = useNavigate();
    const { city } = useParams();

    const tripId = departure[EStopDeparture.trip][ETrip.id];
    const vehicle = departure[EStopDeparture.vehicle];
    const vehicleId = vehicle?.[EVehicle.id];
    const showVehicle = !!vehicleId;
    const tripSuffix = buildCitySuffix(getCityFromUrl(city), city);
    const vehicleSuffix = buildCitySuffix(vehicle?.[EVehicle.city], city);

    const buttons = [
        {
            icon: <AltRoute />,
            label: "showTrip",
            enabled: true,
            onClick: () => {
                navigate(`/${city}/trip/${encodeURIComponent(tripId)}` + tripSuffix, { state: -2 });
            },
        },
        {
            icon: <DirectionsBus />,
            label: "showVehicle",
            enabled: showVehicle,
            onClick: () => {
                if (!vehicleId) return;
                navigate(`/${city}/vehicle/${encodeURIComponent(vehicleId)}` + vehicleSuffix, { state: -2 });
            },
        },
    ] as const;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                "& .MuiButtonBase-root": {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 1,
                    borderRadius: 1,
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                },
            }}
        >
            {buttons
                .filter((button) => button.enabled)
                .map((button) => (
                    <ButtonBase
                        key={button.label}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            button.onClick();
                        }}
                    >
                        {button.icon}
                        {t(button.label)}
                    </ButtonBase>
                ))}
        </Box>
    );
};
