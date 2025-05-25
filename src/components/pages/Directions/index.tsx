import { useNavigate, useParams } from "react-router-dom";
import DirectionsSearchBox from "./DirectionsSearchBox";
import { Dialog } from "@mui/material";
import DirectionsItineraries from "./DirectionsItineraries";

export default () => {
    const navigate = useNavigate();
    const { city } = useParams();

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
            <DirectionsSearchBox onClose={onClose} />
            <DirectionsItineraries />
        </Dialog>
    );
};
