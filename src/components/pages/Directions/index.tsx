import { useNavigate, useParams } from "react-router-dom";
import DirectionsSearchBox from "./DirectionsSearchBox";
import { Dialog } from "@mui/material";
import { Location } from "typings";
import { useState } from "react";

export type DirectionsPlace = {
    name?: string;
    location?: Location;
    text: string;
};

export default () => {
    const navigate = useNavigate();
    const { city } = useParams();

    const [start, setStart] = useState<DirectionsPlace>({ text: "" });
    const [end, setEnd] = useState<DirectionsPlace>({ text: "" });

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
            <DirectionsSearchBox start={[start, setStart]} end={[end, setEnd]} onClose={onClose} />
        </Dialog>
    );
};
