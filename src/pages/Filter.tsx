import { Close, NavigateNext } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { City, FilterData, Vehicle } from "../util/typings";
import getIcon from "../util/icons";

export default ({ city, vehicles }: {
    city: City,
    vehicles: Vehicle[]
}) => {
    const navigate = useNavigate();

    const [filterData, setFilterData] = useState<FilterData>();
    const specialVehicles = filterData ? filterData.special.filter(x => vehicles.find(y => y.tab === x.tab && y.type === x.type)).map(x => ({ ...x, vehicle: vehicles.find(y => y.tab === x.tab && y.type === x.type) })) : [];

    useEffect(() => {
        fetch(`/api/${city}/filter`)
            .then(res => res.json())
            .then(setFilterData)
            .catch(() => {
                toast.error("Fatalny błąd.");
                navigate(`/${city}`);
            });
    }, []);

    return <Dialog
        open
        onClose={() => navigate(`/${city}`)}
        scroll="paper"
        fullScreen
    >
        <DialogTitle>Filtrowanie pojazdów <IconButton style={{ right: 16, top: 14, position: "absolute" }} onClick={() => navigate(`/${city}`)}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            {filterData ? <Routes>
                <Route path="special" element={specialVehicles.length ? specialVehicles.map<React.ReactNode>(vehicle => (
                    <ListItemButton onClick={() => navigate(`/${city}/${vehicle.type}/${vehicle.tab}`)} key={Math.random()}>
                        <ListItemIcon sx={{ minWidth: 40 }}>{getIcon({ size: 24 })[vehicle.type].icon}</ListItemIcon>
                        <ListItemText style={{ display: "inline-flex", alignItems: "center" }}>
                            {vehicle.name} ({vehicle.tab})<br />
                            <span style={{ color: "#757575", fontSize: 15 }}>Na trasie linii {vehicle.vehicle?.line} </span>
                        </ListItemText>
                    </ListItemButton>
                ))?.reduce((prev, curr) => [prev, <Divider key={Math.random()} />, curr]) : null} />
                <Route path="line" element={<></>} />
                <Route path="model" element={<></>} />
                <Route path="*" element={<List>
                    <ListItemButton onClick={() => navigate("special")}>
                        <ListItemText primary="Specjalne pojazdy" />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("line")}>
                        <ListItemText primary="Filtrowanie po linii" />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("model")}>
                        <ListItemText primary="Filtrowanie po modelu pojazdu" />
                        <NavigateNext />
                    </ListItemButton>
                </List>} />
            </Routes> : "Ładowanie..."}
        </DialogContent>
    </Dialog>;
};