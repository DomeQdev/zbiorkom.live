import { Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ToggleButton, Chip, DialogActions, Button, TextField, Autocomplete } from "@mui/material";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { City, FilterData, Vehicle } from "../util/typings";
import { Close, NavigateNext } from "@mui/icons-material";
import { LatLngBoundsExpression } from "leaflet";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { toast } from "react-toastify";
import { translate, Translate } from "../util/Translations";
import getIcon from "../util/icons";
import cities from "../util/cities.json";

export default ({ city, vehicles, onClose }: {
    city: City,
    vehicles: Vehicle[],
    onClose: () => void
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const map = useMap();

    const [filterData, setFilterData] = useState<FilterData>();
    const [selectedLines, setSelectedLines] = useState<string[]>(JSON.parse(localStorage.getItem(`${city}.filter.lines`) || "[]") as string[]);
    const [depots, setDepots] = useState<string[]>(JSON.parse(localStorage.getItem(`${city}.filter.depot`) || "[]") as string[]);
    const [models, setModels] = useState<string[]>(JSON.parse(localStorage.getItem(`${city}.filter.model`) || "[]") as string[]);

    const specialVehicles = vehicles ? vehicles.filter(x => x.isSpecial) : [];

    useEffect(() => {
        if (!cities[city].functions.filter) {
            toast.error(translate("not_available_for_city"));
            navigate(`/${city}`);
        }
        fetch(cities[city].api.filter)
            .then(res => res.json())
            .then((filterData) => {
                if (filterData.error) {
                    toast.error(translate("fatal_error"));
                    return navigate(`/${city}`);
                }
                setFilterData(filterData);
                localStorage.setItem(`${city}.filter.data`, JSON.stringify(filterData));
            })
            .catch(() => {
                toast.error(translate("fatal_error"));
                navigate(`/${city}`);
            });
    }, []);

    return <Dialog
        open
        onClose={onClose}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span><Translate name="vehicles_filtering" /></span><IconButton onClick={() => location.pathname === `/${city}/filter` ? onClose() : navigate(`/${city}/filter`)}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            {filterData ? <Routes>
                <Route path="special" element={specialVehicles.length ? specialVehicles.sort((one, two) => (one.isSpecial! + one.tab > two.isSpecial! + two.tab ? 1 : -1)).map<React.ReactNode>(vehicle => (
                    <ListItemButton onClick={() => navigate(`/${city}/${vehicle.type}/${vehicle.tab}`)} key={vehicle.tab}>
                        <ListItemIcon sx={{ minWidth: 40 }}>{getIcon({ size: 24 })[vehicle.type].icon}</ListItemIcon>
                        <ListItemText style={{ display: "inline-flex", alignItems: "center" }}>
                            {vehicle.isSpecial} ({vehicle.tab})<br />
                            <span style={{ color: "#757575", fontSize: 15 }}><Translate name="on_route" replace={vehicle.line} /></span>
                        </ListItemText>
                    </ListItemButton>
                ))?.reduce((prev, curr) => [prev, <Divider key={Math.random()} />, curr]) : <h3 style={{ textAlign: "center" }}><Translate name="nothing_there" /></h3>} />
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
                <Route path="model" element={<>
                    {filterData.depots && <><Autocomplete
                        options={Object.keys(filterData.depots).sort()}
                        autoHighlight
                        multiple
                        fullWidth
                        disableCloseOnSelect
                        value={depots}
                        onChange={(_, value) => setDepots(value)}
                        renderInput={(params) => <TextField {...params} label={translate("vehicle_depot")} />}
                    /><br /></>}
                    {filterData.models && <Autocomplete
                        options={Object.keys(filterData.models).sort()}
                        autoHighlight
                        multiple
                        fullWidth
                        disableCloseOnSelect
                        value={models}
                        onChange={(_, value) => setModels(value)}
                        renderInput={(params) => <TextField {...params} label={translate("vehicle_model")} />}
                    />}
                </>} />
                <Route path="*" element={<List>
                    <ListItemButton onClick={() => navigate("special")}>
                        <ListItemText primary={translate("special_vehicles")} />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("line")}>
                        <ListItemText primary={translate("line_filtering")} />
                        <NavigateNext />
                    </ListItemButton>
                    {/*<Divider />
                    <ListItemButton onClick={() => navigate("model")}>
                        <ListItemText primary={translate("model_filtering")} />
                        <NavigateNext />
                    </ListItemButton>*/}
                </List>} />
            </Routes> : translate("loading")}
        </DialogContent>
        {location.pathname === `/${city}/filter/line` || location.pathname === `/${city}/filter/model` ? <DialogActions style={{ justifyContent: "space-between" }}>
            <Button onClick={() => {
                localStorage.setItem(`${city}.filter.lines`, JSON.stringify([]));
                navigate(`/${city}`);
            }} variant="outlined" style={{ marginLeft: 5 }}><Translate name="reset" /></Button>

            <Button onClick={() => {
                if(!filterData) return;
                localStorage.setItem(`${city}.filter.lines`, JSON.stringify(selectedLines));
                localStorage.setItem(`${city}.filter.depots`, JSON.stringify(depots));
                localStorage.setItem(`${city}.filter.models`, JSON.stringify(models));

                let _models = models.map(x => filterData.models[x]).flat();
                let _depots = depots.map(x => filterData.depots[x]).flat();

                let found = vehicles
                    .filter(x => selectedLines.length ? selectedLines.includes(x.line) : true)
                    .filter(x => _models.length ? _models.includes(`${x.type}${x.tab}`) : true)
                    .filter(x => _depots.length ? _depots.includes(`${x.type}${x.tab}`) : true);

                toast[found.length ? "success" : "warn"](translate("found_vehicles", String(found.length)));
                (found.length && found.length <= 150) && map.fitBounds(bounds(found));

                navigate(`/${city}`);
            }} variant="contained" color="success" style={{ marginRight: 5 }}><Translate name="save" /></Button>
        </DialogActions> : null}
    </Dialog>;
};

function bounds(vehicles: Vehicle[]) {
    const minLat = Math.min(...vehicles.map(x => x.location[0]));
    const maxLat = Math.max(...vehicles.map(x => x.location[0]));
    const minLng = Math.min(...vehicles.map(x => x.location[1]));
    const maxLng = Math.max(...vehicles.map(x => x.location[1]));
    return [[minLat, minLng], [maxLat, maxLng]] as LatLngBoundsExpression;
}