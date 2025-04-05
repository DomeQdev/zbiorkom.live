import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Build, EventNote, MoreVert, Share, WbSunny } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import cities from "cities";
import useVehicleStore from "@/hooks/useVehicleStore";
import { useShallow } from "zustand/react/shallow";
import { ETrip, EVehicle } from "typings";

export default () => {
    const [vehicle, trip] = useVehicleStore(useShallow((state) => [state.vehicle, state.trip]));

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { t } = useTranslation(["Vehicle", "Shared"]);
    const { city } = useParams();
    const navigate = useNavigate();

    const cityData = cities[city!];

    const showSunPosition = useMemo(() => {
        if (
            !trip ||
            !trip[ETrip.shape] ||
            trip[ETrip.shape].geometry.coordinates.length <= trip[ETrip.stops].length
        ) {
            return false;
        }

        return true;
    }, [trip]);

    return (
        <>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                    marginTop: 1,
                    "& .MuiListItemIcon-root": {
                        minWidth: 30,
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        navigator.share({
                            url: window.location.href,
                        });
                    }}
                >
                    <ListItemIcon>
                        <Share fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t("share", { ns: "Shared" })} />
                </MenuItem>

                {showSunPosition && (
                    <MenuItem
                        onClick={() => navigate(window.location.pathname + "/sun" + window.location.search)}
                    >
                        <ListItemIcon>
                            <WbSunny fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("sunPosition")} />
                    </MenuItem>
                )}

                {!!vehicle?.[EVehicle.brigade] && (
                    <MenuItem
                        onClick={() =>
                            navigate(window.location.pathname + "/brigade" + window.location.search)
                        }
                    >
                        <ListItemIcon>
                            <EventNote fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("brigadeSchedule")} />
                    </MenuItem>
                )}

                {!cityData.disableVehicleInfo && !vehicle?.[EVehicle.id].split("/")[1].startsWith("_") && (
                    <MenuItem
                        onClick={() => navigate(window.location.pathname + "/info" + window.location.search)}
                    >
                        <ListItemIcon>
                            <Build fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("vehicleInfo")} />
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};
