import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Build, EventNote, MoreVert, Share } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useVehicleStore from "@/hooks/useVehicleStore";
import { EVehicle } from "typings";
import { useState } from "react";
import cities from "cities";

export default () => {
    const vehicle = useVehicleStore(((state) => state.vehicle));

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { t } = useTranslation(["Vehicle", "Shared"]);
    const { city } = useParams();
    const navigate = useNavigate();

    const cityData = cities[city!];

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
