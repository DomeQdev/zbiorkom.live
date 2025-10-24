import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Build, EventNote, MoreVert, Report, Share } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useVehicleStore from "@/hooks/useVehicleStore";
import { EStopUpdate, EVehicle } from "typings";
import { useState } from "react";
import TripLastPing from "./TripLastPing";
import { useShallow } from "zustand/react/shallow";
import { share } from "@/util/tools";

export default () => {
    const [vehicle, lastPing, hasAlerts] = useVehicleStore(
        useShallow((state) => [
            state.vehicle,
            state.lastPing,
            state.stops?.some((stop) => stop[EStopUpdate.alerts]?.length > 0),
        ]),
    );

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { t } = useTranslation(["Vehicle", "Shared"]);
    const navigate = useNavigate();

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
                {!!lastPing && (
                    <MenuItem sx={{ pointerEvents: "none" }} disabled>
                        <ListItemText primary={<TripLastPing lastPing={lastPing} />} />
                    </MenuItem>
                )}

                <MenuItem onClick={() => share(window.location.href)}>
                    <ListItemIcon>
                        <Share fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t("share", { ns: "Shared" })} />
                </MenuItem>

                {hasAlerts && (
                    <MenuItem
                        onClick={() =>
                            navigate(window.location.pathname + "/alerts" + window.location.search)
                        }
                    >
                        <ListItemIcon>
                            <Report fontSize="small" sx={{ color: "error.contrastText" }} />
                        </ListItemIcon>
                        <ListItemText primary={t("alerts")} />
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

                {vehicle && !vehicle[EVehicle.id].split("/")[1].startsWith("_") && (
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
