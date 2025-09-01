import { useQueryPlannerItineraries } from "@/hooks/useQueryTripPlanner";
import DirectionsItineraries from "./DirectionsItineraries";
import { useNavigate, useParams } from "react-router-dom";
import DirectionsSearchBox from "./DirectionsSearchBox";
import usePlacesStore from "@/hooks/usePlacesStore";
import { lazy, Suspense } from "react";
import { Dialog } from "@mui/material";
import BikeComfort from "./BikeComfort";

const RoutingAnimation = lazy(() => import("./RoutingAnimation"));

const now = Date.now();

export default () => {
    const { from, to } = usePlacesStore((state) => state.places);
    const navigate = useNavigate();
    const { city } = useParams();

    const {
        data: plannerResult,
        refetch,
        isLoading,
        isRefetching,
    } = useQueryPlannerItineraries(city!, from, to, now, false);

    const onClose = () => navigate(`/${city}`);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loading = isLoading || isRefetching;

    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth={window.innerWidth > 600}
            fullScreen={window.innerWidth <= 600}
            sx={(theme) => ({
                "& .MuiDialog-paper": {
                    [theme.breakpoints.up("sm")]: {
                        height: "70%",
                    },
                },
            })}
        >
            <DirectionsSearchBox isLoading={loading} refresh={refetch} onClose={onClose} />
            <BikeComfort />

            {loading && !prefersReducedMotion && (
                <Suspense>
                    <RoutingAnimation />
                </Suspense>
            )}

            {!loading && plannerResult && <DirectionsItineraries itineraries={plannerResult.itineraries} />}
        </Dialog>
    );
};
