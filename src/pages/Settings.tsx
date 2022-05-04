import { Close, NavigateNext } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemText, DialogActions, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { City, MapStyle } from "../util/typings";
import cities from "../util/cities.json";

export default () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mapStyle, setMapStyle] = useState<MapStyle>(localStorage.getItem("mapstyle") as MapStyle || "gmaps");

    return <Dialog
        open
        onClose={() => navigate("/")}
        scroll="paper"
        fullScreen
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Ustawienia</span><IconButton onClick={() => location.pathname === "/settings" ? navigate("/") : navigate("/settings")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            <Routes>
                <Route path="*" element={<List>
                    <ListItemButton onClick={() => navigate("city")}>
                        <ListItemText primary="Zmiana miasta" />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("style")}>
                        <ListItemText primary="Styl mapy" />
                        <NavigateNext />
                    </ListItemButton>
                    {/*<Divider />
                    <ListItemButton onClick={() => navigate("vehicles")}>
                        <ListItemText primary="Wyświetlanie pojazdów" />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("language")}>
                        <ListItemText primary="Język (Language)" />
                        <NavigateNext />
                    </ListItemButton>*/}
                </List>} />
                <Route path="city" element={<List>
                    {Object.keys(cities).map<React.ReactNode>((city) => (<ListItemButton onClick={() => {
                        localStorage.setItem("city", city);
                        toast.success(`Zmieniono miasto na ${cities[city as City].name}`);
                        navigate(`/${city}`);
                    }}>
                        <ListItemText primary={cities[city as City].name} />
                        <NavigateNext />
                    </ListItemButton>)).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])}
                </List>} />
                <Route path="style" element={<FormControl>
                    <FormLabel>Styl mapy</FormLabel>
                    <RadioGroup
                        value={mapStyle}
                        onChange={({ target }) => setMapStyle(target.value as MapStyle)}
                    >
                        <FormControlLabel value="gmaps" control={<Radio />} label="Google Maps" />
                        <FormControlLabel value="gsat" control={<Radio />} label="Google Satelita" />
                        <FormControlLabel value="osm" control={<Radio />} label="OpenStreetMap" />
                        <FormControlLabel value="mapbox" control={<Radio />} label="Mapbox" />
                        <FormControlLabel value="mapstr" control={<Radio />} label="Mapbox Streets" />
                        <FormControlLabel value="mapnav" control={<Radio />} label="Mapbox Navigation" />
                        <FormControlLabel value="mapsat" control={<Radio />} label="Mapbox Satelita" />
                    </RadioGroup>
                </FormControl>} />
                <Route path="vehicles" element={<></>} />
                <Route path="language" element={<></>} />
            </Routes>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => navigate("/")} variant="outlined">Anuluj</Button>
            <Button onClick={() => {
                localStorage.setItem("mapstyle", mapStyle);
                toast.success("Zapisano ustawienia");
                navigate("/");
            }} variant="contained" color="success">Zapisz</Button>
        </DialogActions>
    </Dialog>;
};