import { useNavigate, useParams } from "react-router-dom";
import DirectionsSearchBox from "./DirectionsSearchBox";
import { Dialog } from "@mui/material";
import DirectionsItineraries from "./DirectionsItineraries";
import usePlacesStore from "@/hooks/usePlacesStore";
import { useQueryPlannerItineraries } from "@/hooks/useQueryTripPlanner";

const now = Date.now();

export default () => {
    const { from, to } = usePlacesStore((state) => state.places);
    const navigate = useNavigate();
    const { city } = useParams();

    const {
        data: itineraries,
        refetch,
        isLoading,
        isRefetching,
    } = useQueryPlannerItineraries(city!, from, to, now, false);

    const onClose = () => navigate(`/${city}`);

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
            <DirectionsSearchBox isLoading={isLoading || isRefetching} refresh={refetch} onClose={onClose} />

            {itineraries && <DirectionsItineraries itineraries={itineraries} />}
        </Dialog>
    );
};
