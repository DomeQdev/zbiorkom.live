import { Close, NavigateNext } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ToggleButton, Chip, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { City, FilterData, Vehicle } from "../util/typings";
import { toast } from "react-toastify";
import getIcon from "../util/icons";
import cities from "../util/cities.json";

export default ({ city, vehicles, onClose }: {
    city: City,
    vehicles: Vehicle[],
    onClose: () => void
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [filterData, setFilterData] = useState<FilterData>();
    const [selectedLines, setSelectedLines] = useState<string[]>(JSON.parse(localStorage.getItem(`${city}.filter.lines`) || "[]") as string[]);
    const specialVehicles = vehicles ? vehicles.filter(x => x.isSpecial) : [];

    useEffect(() => {
        if(!cities[city].functions.filter) {
            toast.error("Przepraszamy, filtrowanie nie jest dostępne w tym mieście.");
            navigate(`/${city}`);
        }
        fetch(cities[city].api.filter)
            .then(res => res.json())
            .then((filterData) => {
                if(filterData.error) {
                    toast.error("Fatalny błąd.");
                    return navigate(`/${city}`);
                }
                setFilterData(filterData);
            })
            .catch(() => {
                toast.error("Fatalny błąd.");
                navigate(`/${city}`);
            });
    }, []);

    return <Dialog
        open
        onClose={onClose}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Filtrowanie pojazdów</span><IconButton onClick={() => location.pathname === `/${city}/filter` ? onClose() : navigate(`/${city}/filter`)}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            {filterData ? <Routes>
                <Route path="special" element={specialVehicles.length ? specialVehicles.sort((one, two) => (one.isSpecial! + one.tab > two.isSpecial! + two.tab ? 1 : -1)).map<React.ReactNode>(vehicle => (
                    <ListItemButton onClick={() => navigate(`/${city}/${vehicle.type}/${vehicle.tab}`)} key={vehicle.tab}>
                        <ListItemIcon sx={{ minWidth: 40 }}>{getIcon({ size: 24 })[vehicle.type].icon}</ListItemIcon>
                        <ListItemText style={{ display: "inline-flex", alignItems: "center" }}>
                            {vehicle.isSpecial} ({vehicle.tab})<br />
                            <span style={{ color: "#757575", fontSize: 15 }}>Na trasie linii {vehicle.line}</span>
                        </ListItemText>
                    </ListItemButton>
                ))?.reduce((prev, curr) => [prev, <Divider key={Math.random()} />, curr]) : <h3 style={{ textAlign: "center" }}>Nic tu nie ma...</h3>} />
                <Route path="line" element={<div style={{ textAlign: "center" }}>
                    {Object.values(filterData.routes).filter(x => selectedLines.includes(x.line)).map(line => (
                        <Chip 
                            key={line.line}
                            label={line.line}
                            style={{ margin: 3 }}
                            onDelete={() => setSelectedLines(selectedLines.filter(x => x !== line.line))}
                        />
                    ))}<br />
                    {Object.values(filterData.routes).filter(x => x.showFilter !== false).sort().map<React.ReactNode>((line) => (
                        <ToggleButton
                            value={line.line}
                            key={line.line}
                            selected={selectedLines.includes(line.line)}
                            onClick={() => setSelectedLines(selectedLines.includes(line.line) ? selectedLines.filter(x => x !== line.line) : [...selectedLines, line.line])}
                            style={{ width: 75, height: 50, fontSize: 20, color: line.color, margin: 3, borderColor: selectedLines.includes(line.line) ? line.color : "#0000001f" }}
                            title={`${line.line} - ${line.name}`}
                        >
                            {getIcon({ size: 20 })[line.type].icon}<span style={{ width: 3 }} />{line.line.replace("-", "")}
                        </ToggleButton>
                    ))}
                </div>} />
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
                    {/*<Divider />
                    <ListItemButton onClick={() => navigate("model")}>
                        <ListItemText primary="Filtrowanie po modelu pojazdu" />
                        <NavigateNext />
                    </ListItemButton>*/}
                </List>} />
            </Routes> : "Ładowanie..."}
        </DialogContent>
        {location.pathname === `/${city}/filter/line` || location.pathname === `/${city}/filter/model` ? <DialogActions style={{ justifyContent: "space-between" }}>
            <Button onClick={() => {
                localStorage.setItem(`${city}.filter.lines`, JSON.stringify([]));
                navigate(`/${city}`);
            }} variant="outlined" style={{ marginLeft: 5 }}>Zrestuj</Button>
            <Button onClick={() => {
                localStorage.setItem(`${city}.filter.lines`, JSON.stringify(selectedLines));
                navigate(`/${city}`);
            }} variant="contained" color="success" style={{ marginRight: 5 }}>Zapisz</Button>
        </DialogActions> : null}
    </Dialog>;
};