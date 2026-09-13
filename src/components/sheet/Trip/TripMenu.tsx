import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { Build, EventNote, MoreVert, Report, Share } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useVehicleStore from "@/hooks/useVehicleStore";
import { EVehicle } from "typings";
import { useState } from "react";
import TripLastPing from "./TripLastPing";
import { useShallow } from "zustand/react/shallow";
import { parseVehicleId, share } from "@/util/tools";

export default () => {
    const [vehicle, lastPing, alertCount] = useVehicleStore(
        useShallow((state) => [state.vehicle, state.lastPing, state.alerts.length]),
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

                {alertCount > 0 && (
                    <MenuItem
                        onClick={() =>
                            navigate(window.location.pathname + "/alerts" + window.location.search)
                        }
                    >
                        <ListItemIcon>
                            <Report fontSize="small" sx={{ color: "warning.main" }} />
                        </ListItemIcon>
                        <ListItemText primary={t("alerts")} />
                        <Typography variant="body2" sx={{ color: "text.secondary", marginLeft: 2 }}>
                            {alertCount}
                        </Typography>
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

                {vehicle && !parseVehicleId(vehicle[EVehicle.id]).vehicleNumber.startsWith("_") && (
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
