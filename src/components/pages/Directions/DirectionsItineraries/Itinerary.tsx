import { DirectionsBike, DirectionsWalk } from "@mui/icons-material";
import { Box, ButtonBase, SvgIcon, Typography } from "@mui/material";
import { NonTransitLeg, PlannerItinerary, TransitLeg } from "typings";
import ItineraryTransitLeg from "./ItineraryTransitLeg";

export default ({ itinerary }: { itinerary: PlannerItinerary }) => {
    return (
        <ButtonBase
            sx={{ width: "100%", padding: "8px", justifyContent: "space-between", alignItems: "flex-start" }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, marginRight: "8px" }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, }}>
                    {itinerary.legs.map((leg, index) =>
                        leg.mode === "TRANSIT" ? (
                            <ItineraryTransitLeg key={index} leg={leg as TransitLeg} />
                        ) : (
                            <ItineraryNonTransitLeg key={index} leg={leg as NonTransitLeg} />
                        )
                    )}
                </Box>
                <Typography variant="caption">
                    xyz
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                30 min
            </Typography>
        </ButtonBase>
    );
};

const ItineraryNonTransitLeg = ({ leg }: { leg: NonTransitLeg }) => {
    if (leg.mode === "WALK" && leg.duration > 60000 * 3) return <DirectionsWalk />;
    if (leg.mode === "BIKE") return <DirectionsBike />;
    if (leg.mode === "RENTAL")
        return (
            <SvgIcon
                width="64"
                height="43.395"
                viewBox="0 0 48 32.546"
                sx={{
                    backgroundColor: "#0046d7",
                }}
            >
                <path d="M32.5 2.014c-2.459.539-5.877 2.084-7.657 3.512-.094.094.632 1.054 1.78 2.388l.656.796 1.381-.843c1.897-1.147 3.629-1.756 5.807-2.084l1.826-.258V1.639l-1.1.023c-.632 0-1.826.164-2.693.351M1.358 3.98c-.913.562-.375 4.871.983 7.868l.702 1.545-.96 1.967c-.89 1.756-.983 2.154-1.1 4.144-.164 3.395.679 5.76 2.95 8.172 2.178 2.318 4.847 3.465 8.125 3.465 5.034 0 9.366-3.208 10.747-7.938.539-1.873.492-6.018-.094-8.312-1.264-4.964-4.94-8.968-9.6-10.49-1.288-.421-2.248-.492-6.439-.585-3.301-.047-5.058 0-5.315.164m5.924 13.744c.656.468 1.897 1.1 2.74 1.428 1.381.539 2.014.609 5.409.702l3.817.094-.14 1.054c-.656 4.847-5.83 7.54-10.279 5.362-2.459-1.194-4.144-4.144-3.84-6.72.14-1.077.726-2.786.96-2.786.07 0 .679.375 1.335.866m26.552-8.242c-1.803.492-2.716.937-4.098 1.967-2.178 1.639-3.419 3.489-4.074 6.041-1.803 6.954 3.536 13.651 10.888 13.651 4.332 0 8.031-2.295 9.928-6.158 2.037-4.238 1.335-8.827-1.92-12.34-2.646-2.857-7.048-4.168-10.724-3.161m5.666 4.379c1.335.632 2.669 1.92 3.395 3.278.445.82.539 1.381.539 2.997 0 1.709-.094 2.154-.632 3.184-1.171 2.224-3.301 3.606-5.83 3.793-2.131.14-3.606-.375-5.221-1.85s-2.295-2.974-2.295-5.128c0-5.104 5.385-8.476 10.045-6.275" />
            </SvgIcon>
        );
};
