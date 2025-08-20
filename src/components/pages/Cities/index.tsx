import { Logo } from "@/ui/Icon";
import { Dialog, DialogContent, DialogTitle, Fade, Typography } from "@mui/material";
import { LeftParticles, RightParticles } from "./Particles";
import { cityList } from "cities";
import { forwardRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslation } from "react-i18next";
import CitySelect from "./CitySelect";
import { useMap } from "@vis.gl/react-maplibre";
import { useNavigate } from "react-router-dom";

const color = "#cdeda3";

export default () => {
    const { t } = useTranslation("Settings");
    const [open, setOpen] = useState(true);
    const { current: map } = useMap();
    const navigate = useNavigate();

    return (
        <Dialog
            open={open}
            fullWidth
            slots={{
                transition: forwardRef(
                    (
                        props: TransitionProps & { children: React.ReactElement<any, any> },
                        ref: React.Ref<unknown>
                    ) => {
                        return <Fade style={{ transitionDelay: "50ms" }} ref={ref} {...props} />;
                    }
                ),
            }}
            sx={{
                zIndex: 5001,
                "& .MuiDialog-container": {
                    height: undefined,
                    overflow: "visible",
                },
                "& .MuiDialog-paper": {
                    overflow: "visible",
                    position: "relative",
                    backgroundColor: "#292a2d",
                    color: "#e3e3e3",
                },
            }}
        >
            <LeftParticles />
            <RightParticles />

            <DialogTitle
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 5002,
                }}
                component="div"
            >
                <Logo
                    sx={{
                        width: 128,
                        height: "auto",
                        filter: `drop-shadow(0 0 16px ${color})`,
                        color,
                    }}
                />

                <Typography
                    variant="h5"
                    sx={{
                        "& b": {
                            color,
                            fontWeight: 600,
                            textShadow: `0 0 16px ${color}`,
                        },
                    }}
                >
                    {t("welcomeTo")} <b>zbiorkom.live</b>
                </Typography>

                <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
                    {t("welcomeText")}
                </Typography>
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    padding: 0,
                    marginY: 1,
                }}
            >
                <CitySelect
                    cities={cityList}
                    onCityClick={(city) => {
                        setOpen(false);
                        localStorage.setItem("city", city.id);

                        window.skipPadding = true;
                        map?.flyTo({
                            center: city.location,
                            zoom: city.zoom || 16,
                            duration: 0,
                            padding: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                            },
                        });

                        setTimeout(() => navigate(`/${city.id}`), 100);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};
