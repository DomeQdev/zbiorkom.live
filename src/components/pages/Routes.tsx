import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Menu, Search } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { VirtuosoGrid } from "react-virtuoso";
import RouteChip from "@/ui/RouteChip";
import Helm from "@/util/Helm";
import useQueryRoutes from "@/hooks/useQueryRoutes";
import { ERoute } from "typings";

export default () => {
    const { t } = useTranslation("Schedules");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { city } = useParams();

    const { data } = useQueryRoutes({
        city: city!,
    });

    const routes = data?.filter((route) => route[ERoute.name].toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <Helm variable="schedules" />

            <Dialog open fullScreen>
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <IconButton onClick={() => navigate(window.location.pathname, { state: "menu" })}>
                        <Menu />
                    </IconButton>
                    {t("schedules")}
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    {routes ? (
                        <>
                            <TextField
                                size="small"
                                placeholder={t("search")}
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{
                                    px: 2,
                                    pb: 1,
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                        autoComplete: "off",
                                    },
                                }}
                            />

                            <VirtuosoGrid
                                data={routes || []}
                                itemContent={(i, route) => (
                                    <RouteChip
                                        route={route}
                                        onClick={() =>
                                            navigate(`/${city}/route/${route[ERoute.id]}`, { state: -3 })
                                        }
                                    />
                                )}
                                style={{ height: "calc(100% - 48px)" }}
                                components={{
                                    //@ts-ignore
                                    List: forwardRef(({ style, children, ...props }, ref) => (
                                        <div
                                            {...props}
                                            ref={ref}
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: "center",
                                                marginLeft: 8,
                                                marginRight: 8,
                                                gap: 8,
                                                ...style,
                                            }}
                                        >
                                            {children}
                                        </div>
                                    )),
                                }}
                            />
                        </>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}>
                            <CircularProgress />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
