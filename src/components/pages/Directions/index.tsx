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

    const isAllowed =
        localStorage.getItem("themeColor") === "#720546" &&
        localStorage.getItem("brigade") === "true" &&
        localStorage.getItem("language") === "en";

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
            {isAllowed ? (
                <>
                    <DirectionsSearchBox
                        isLoading={isLoading || isRefetching}
                        refresh={refetch}
                        onClose={onClose}
                    />

                    {itineraries && <DirectionsItineraries itineraries={itineraries} />}
                </>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        fontSize: "1.5rem",
                        color: "#720546",
                        padding: "20px",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#720546",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    >
                        Zamknij to okno 🤫🤫
                    </button>
                </div>
            )}
        </Dialog>
    );
};
