import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, IconButton, List, SwipeableDrawer } from "@mui/material";
import { useTranslation } from "react-i18next";
import MenuItem from "./MenuItem";
import cities from "cities";
import {
    AlternateEmail,
    Chat,
    CopyrightOutlined,
    DirectionsBike,
    EventNote,
    EventNoteOutlined,
    Facebook,
    Instagram,
    KeyboardArrowDown,
    Newspaper,
    Place,
    PlaceOutlined,
    Settings,
    SettingsOutlined,
} from "@mui/icons-material";
import { Logo } from "@/ui/Icon";

export default ({
    open,
    setOpen,
    setClose,
}: {
    open: boolean;
    setOpen: () => void;
    setClose: () => void;
}) => {
    const { t } = useTranslation("Menu");
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { city } = useParams();

    const path = pathname.split("/")[2];

    return (
        <SwipeableDrawer
            anchor="left"
            open={open}
            onOpen={setOpen}
            onClose={setClose}
            sx={{
                "& .MuiDrawer-paper": {
                    borderRadius: "0 16px 16px 0",
                    minWidth: 240,
                },
                zIndex: 1400,
            }}
            disableSwipeToOpen
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingRight: 2,
                    color: "hsla(0, 0%, 100%, 0.9)",
                    cursor: "pointer",
                }}
                onClick={() => navigate("/cities")}
                onAuxClick={() => navigate(`/${city}/traffic`, { state: undefined })}
            >
                <Logo sx={{ width: 72, height: 72, fill: "hsla(0, 0%, 100%, 0.9)" }} />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <b>Zbiorkom.live</b>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        {cities[city!]?.name}
                        <KeyboardArrowDown />
                    </span>
                </Box>
            </Box>

            <List
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mx: 1,
                }}
            >
                <MenuItem
                    icon={<Place />}
                    outlinedIcon={<PlaceOutlined />}
                    name={t("map")}
                    active={!path}
                    onClick={() => navigate(`/${city}`, { state: undefined })}
                />
                <MenuItem
                    icon={<EventNote />}
                    outlinedIcon={<EventNoteOutlined />}
                    name={t("schedules")}
                    active={path === "routes"}
                    onClick={() => navigate(`/${city}/routes`, { state: undefined })}
                />
                <MenuItem
                    icon={<Newspaper />}
                    outlinedIcon={<Newspaper />}
                    name={t("blog")}
                    active={path === "blog"}
                    onClick={() => navigate(`/${city}/blog`, { state: undefined })}
                />
                <MenuItem
                    icon={<CopyrightOutlined />}
                    outlinedIcon={<CopyrightOutlined />}
                    name={t("dataSources")}
                    active={path === "copyright"}
                    onClick={() => navigate(`/${city}/copyright`, { state: undefined })}
                />
                {/* {city === "warsaw" && (
                    <MenuItem
                        icon={<DirectionsBike />}
                        outlinedIcon={<DirectionsBike />}
                        name="VETURILO"
                        active={path === "veturilo"}
                        onClick={() => navigate(`/${city}/veturilo`, { state: undefined })}
                    />
                )} */}
                <MenuItem
                    icon={<Settings />}
                    outlinedIcon={<SettingsOutlined />}
                    name={t("settings")}
                    active={path === "settings"}
                    onClick={() => navigate(`/${city}/settings`, { state: undefined })}
                />
            </List>

            <div
                style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    color: "hsla(0, 0%, 100%, 0.6)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box>
                    <IconButton href="https://www.facebook.com/profile.php?id=61558868339377" target="_blank">
                        <Facebook htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                    <IconButton href="https://www.instagram.com/zbiorkom.live/" target="_blank">
                        <Instagram htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                    <IconButton href="https://discord.gg/gUhMz2Wckf" target="_blank">
                        <Chat htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                    <IconButton href="mailto:admin@zbiorkom.live" target="_blank">
                        <AlternateEmail htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                </Box>
                <span
                    style={{ fontSize: "0.75rem", cursor: "none" }}
                    onClick={() => window.open("https://www.openstreetmap.org/copyright", "_blank")}
                >
                    &copy; OpenStreetMap contributors
                </span>
            </div>
        </SwipeableDrawer>
    );
};
