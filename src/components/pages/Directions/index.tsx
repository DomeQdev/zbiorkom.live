import { useNavigate, useParams } from "react-router-dom";
import DirectionsSearchBox from "./DirectionsSearchBox";
import { Dialog } from "@mui/material";
import { Location } from "typings";
import { useState } from "react";
import DirectionsItineraries from "./DirectionsItineraries";

export type DirectionsPlace = {
    name?: string;
    location?: Location;
    text: string;
};

export default () => {
    const navigate = useNavigate();
    const { city } = useParams();

    const [from, setFrom] = useState<DirectionsPlace>({ text: "", location: [21.10044, 52.24483] });
    const [to, setTo] = useState<DirectionsPlace>({ text: "", location: [19.35293, 52.23348] });

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
            <DirectionsSearchBox from={[from, setFrom]} to={[to, setTo]} onClose={onClose} />

            {from.location && to.location && <DirectionsItineraries from={from} to={to} />}
        </Dialog>
    );
};
