import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import { Dialog } from "@mui/material";
import useGoBack from "@/hooks/useGoBack";
import useVehicleStore from "@/hooks/useVehicleStore";
import { EVehicle } from "typings";

import "./brigades.css";

export default () => {
    const vehicle = useVehicleStore((state) => state.vehicle);
    const { city } = useParams();
    const goBack = useGoBack();

    return (
        <Dialog
            fullWidth={window.innerWidth > 600}
            fullScreen={window.innerWidth <= 600}
            open
            onClose={() => goBack()}
        >
            <Schedule
                city={window.location.search.includes("pkp") ? "pkp" : city!}
                route={vehicle?.[EVehicle.route]}
                brigade={vehicle?.[EVehicle.brigade]}
            />
        </Dialog>
    );
};
