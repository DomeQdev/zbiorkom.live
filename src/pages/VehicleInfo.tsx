import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { City, Vehicle, VehicleInfo } from "../util/typings";
import cities from "../util/cities.json";

export default ({ city, vehicle }: {
    city: City,
    vehicle: Vehicle
}) => {
    const navigate = useNavigate();
    const [info, setInfo] = useState<VehicleInfo>();

    useEffect(() => {
        if (!cities[city].functions.vehicleInfo) {
            toast.error(`Przepraszamy, funkcja nie dostępna dla tego miasta.`);
            return navigate("../");
        }
        fetch(cities[city].api.vehicleInfo!.replace("{{tab}}", vehicle.tab.split("+")[0]).replace("{{type}}", vehicle.type)).then(res => res.json()).then(data => {
            if (data.error) {
                toast.error("Nie znaleziono pojazdu.")
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
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Informacje o pojeździe</span><IconButton onClick={() => navigate("../")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            <b>Nr taborowy:</b> {vehicle.tab}<br />
            {vehicle?.isSpecial && <><b style={{ color: "#F5CF4B" }}>{vehicle.isSpecial}</b><br /></>}
            {info?.model && <><b>Model:</b> {info.model}<br /></>}
            {info?.prodYear && <><b>Rok produkcji:</b> {info.prodYear}<br /></>}
            {info?.description && <><b>Opis:</b> {info.description}<br /></>}
            {info?.registration && <><b>Rejestracja:</b> {info.registration}<br /></>}
            {info?.carrier && <><b>Operator:</b> {info.carrier}<br /></>}
            {info?.depot && <><b>Zajezdnia:</b> {info.depot}<br /></>}
            {info?.doors && <><b>Ilość drzwi:</b> {info.doors}<br /></>}
            {info?.seats && <><b>Ilość siedzeń:</b> {info.seats}<br /></>}
            {info?.bikes && <><b>Stojaki na rowery:</b> {info.bikes}<br /></>}
            {info?.features && <p style={{ lineHeight: 1 }}>{info.features.join(", ")}</p>}
        </DialogContent>
    </Dialog>;
};