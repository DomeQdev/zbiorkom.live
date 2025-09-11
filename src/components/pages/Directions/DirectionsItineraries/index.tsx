import { Box, ButtonBase, Grow, Typography } from "@mui/material";
import ItineraryTransitLeg from "./ItineraryTransitLeg";
import ItineraryNonTransitLeg from "./ItineraryNonTransitLeg";
import { getTime, msToTime } from "@/util/tools";
import useTripPlannerStore from "@/hooks/useTripPlannerStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TripLastPing from "@/sheet/Trip/TripLastPing";
import { useTranslation } from "react-i18next";
import { RssFeed } from "@mui/icons-material";

export default () => {
    const { t } = useTranslation("Directions");
    const { city } = useParams();

    const [itineraries, updateDepartures, lastRefresh] = useTripPlannerStore(
        useShallow((state) => [state.itineraries, state.updateDepartures, state.lastRefresh])
    );

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.hidden) return;

            updateDepartures(city!);
        }, 45000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Grow in>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.25,
                        margin: 2,
                        "& > :first-of-type": {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                        },
                        "& > :last-of-type": {
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                        },
                    }}
                >
                    {itineraries?.map((itinerary) => (
                        <ButtonBase
                            sx={{
                                width: "100%",
                                paddingX: 1.5,
                                paddingY: 1,
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: "background.paper",
                                alignItems: "flex-start",
                            }}
                            key={`itinerary-${itinerary.itineraryIndex}`}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                                    {itinerary.legs.map((leg, legIndex) => {
                                        const key = `leg-${itinerary.itineraryIndex}-${legIndex}`;

                                        if (leg.mode === "TRANSIT") {
                                            return <ItineraryTransitLeg key={key} leg={leg} />;
                                        } else {
                                            return <ItineraryNonTransitLeg key={key} leg={leg} />;
                                        }
                                    })}
                                </Box>

                                <Typography
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {msToTime(itinerary.duration)}
                                    <RssFeed fontSize="small" color="success" />
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    marginTop: 1,
                                    "& > span": {
                                        color: "primary.contrastText",
                                        backgroundColor: "primary.main",
                                        paddingX: 1,
                                        paddingY: 0.5,
                                        borderRadius: 0.5,
                                    },
                                }}
                            >
                                <span>
                                    {t("leave")} <b>{getTime(itinerary.departureTime)}</b>
                                </span>
                                <span>
                                    {t("arrive")} <b>{getTime(itinerary.arrivalTime)}</b>
                                </span>
                            </Box>
                        </ButtonBase>
                    ))}
                </Box>

                {!!lastRefresh && (
                    <Typography
                        variant="caption"
                        sx={{ display: "block", textAlign: "right", marginRight: 2, color: "text.secondary" }}
                    >
                        {t("lastUpdated")}: <TripLastPing lastPing={lastRefresh} />
                    </Typography>
                )}
            </Box>
        </Grow>
    );
};
