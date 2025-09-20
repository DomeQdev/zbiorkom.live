import { useQueryPlannerItineraries } from "@/hooks/useQueryTripPlanner";
import useTripPlannerStore from "@/hooks/useTripPlannerStore";
import DirectionsItineraries from "./DirectionsItineraries";
import { useNavigate, useParams } from "react-router-dom";
import DirectionsSearchBox from "./DirectionsSearchBox";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { Sick } from "@mui/icons-material";
import { lazy, Suspense } from "react";
import { Dialog } from "@mui/material";
import Alert from "@/ui/Alert";

const RoutingAnimation = lazy(() => import("./RoutingAnimation"));

export default () => {
    const { t } = useTranslation("Directions");
    const navigate = useNavigate();
    const { city } = useParams();

    const [{ from, to }, time, reset] = useTripPlannerStore(
        useShallow((state) => [state.places, state.time, state.reset])
    );

    const {
        data: showItineraries,
        error,
        refetch,
        isLoading,
        isRefetching,
    } = useQueryPlannerItineraries(city!, from, to, time);

    const onClose = () => {
        navigate(`/${city}`);
        reset();
    };

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

            {loading ? (
                <Suspense>
                    <RoutingAnimation />
                </Suspense>
            ) : (
                <>
                    {showItineraries === true && <DirectionsItineraries />}
                    {(showItineraries === false || error) && (
                        <Alert
                            Icon={Sick}
                            title={t("noResultsFound")}
                            description={t("noResultsFoundDescription")}
                            color="error"
                        />
                    )}
                </>
            )}
        </Dialog>
    );
};
