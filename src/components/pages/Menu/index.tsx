import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, IconButton, List, SwipeableDrawer } from "@mui/material";
import { useTranslation } from "react-i18next";
import MenuItem from "./MenuItem";
import { DiscordIcon, Logo } from "@/ui/Icon";
import cities from "cities";
import {
    Email,
    EventNote,
    EventNoteOutlined,
    Facebook,
    GitHub,
    History,
    Instagram,
    KeyboardArrowDown,
    Newspaper,
    Place,
    PlaceOutlined,
    Settings,
    SettingsOutlined,
} from "@mui/icons-material";

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
                    icon={<History />}
                    outlinedIcon={<History />}
                    name={t("executions")}
                    active={path === "executions"}
                    onClick={() => navigate(`/${city}/executions`, { state: undefined })}
                />
                <MenuItem
                    icon={<Settings />}
                    outlinedIcon={<SettingsOutlined />}
                    name={t("settings")}
                    active={path === "settings"}
                    onClick={() => navigate(`/${city}/settings`, { state: undefined })}
                />
            </List>

            {localStorage.getItem("themeColor") === "#720546" && (
                <img
                    src="/zandbi.jpg"
                    style={{
                        width: "100%",
                        height: "auto",
                        position: "absolute",
                        bottom: 0,
                        opacity: 0.7,
                        pointerEvents: "none",
                        touchAction: "none",
                        maskImage: "linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0))",
                        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0))",
                    }}
                />
            )}

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
                    <IconButton href="https://github.com/DomeQdev/zbiorkom.live" target="_blank">
                        <GitHub htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                    <IconButton href="https://discord.gg/gUhMz2Wckf" target="_blank">
                        <DiscordIcon htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                    <IconButton href="mailto:admin@zbiorkom.live" target="_blank">
                        <Email htmlColor="hsla(0, 0%, 100%, 0.6)" />
                    </IconButton>
                </Box>

                <a
                    style={{
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                    href="/privacy-policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t("privacyPolicy")}
                </a>
                <span
                    style={{ fontSize: "0.75rem", cursor: "pointer" }}
                    onClick={() => window.open("https://www.openstreetmap.org/copyright", "_blank")}
                >
                    &copy; OpenStreetMap contributors
                </span>
            </div>
        </SwipeableDrawer>
    );
};
