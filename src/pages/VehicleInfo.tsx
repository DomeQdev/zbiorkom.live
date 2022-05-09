import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { City, Vehicle, VehicleInfo } from "../util/typings";
import { translate, Translate } from "../util/Translations";
import cities from "../util/cities.json";

export default ({ city, vehicle }: {
    city: City,
    vehicle: Vehicle
}) => {
    const navigate = useNavigate();
    const [info, setInfo] = useState<VehicleInfo>();

    useEffect(() => {
        if (!cities[city].functions.vehicleInfo) {
            toast.error(translate("not_available_for_city"));
            return navigate("../");
        }
        fetch(cities[city].api.vehicleInfo!.replace("{{tab}}", vehicle.tab.split("+")[0]).replace("{{type}}", vehicle.type)).then(res => res.json()).then(data => {
            if (data.error) {
                toast.error(translate("vehicle_not_found"))
                return navigate("../");
            }
            setInfo(data);
        });
    }, []);

    return <Dialog
        open
        onClose={() => navigate("../")}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span><Translate name="vehicle_info" /></span><IconButton onClick={() => navigate("../")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            <b><Translate name="vehicle_number" />:</b> {vehicle.tab}<br />
            {vehicle?.isSpecial && <><b style={{ color: "#F5CF4B" }}>{vehicle.isSpecial}</b><br /></>}
            {(info?.description && !vehicle?.isSpecial) && <>{info.description}<br /></>}
            {info?.model && <><b><Translate name="vehicle_model" />:</b> {info.model}<br /></>}
            {info?.prodYear && <><b><Translate name="vehicle_production_year" />:</b> {info.prodYear}<br /></>}
            {info?.registration && <><b><Translate name="vehicle_registration" />:</b> {info.registration}<br /></>}
            {info?.carrier && <><b><Translate name="vehicle_carrier" />:</b> {info.carrier}<br /></>}
            {info?.depot && <><b><Translate name="vehicle_depot" />:</b> {info.depot}<br /></>}
            {info?.features && <p style={{ lineHeight: 1 }}>{info.features.join(", ")}</p>}
        </DialogContent>
    </Dialog>;
};