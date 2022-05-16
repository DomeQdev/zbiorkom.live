import { Close, NavigateNext } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemText, DialogActions, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, ListItemIcon } from "@mui/material";
import React, { useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { City, MapStyle } from "../util/typings";
import { translate, Translate } from "../util/Translations";
import languages from "../util/translations.json";
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
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span><Translate name="settings" /></span><IconButton onClick={() => location.pathname === "/settings" ? navigate("/") : navigate("/settings")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            <Routes>
                <Route path="*" element={<List>
                    <ListItemButton onClick={() => navigate("city")}>
                        <ListItemText primary={translate("city_change")} />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("style")}>
                        <ListItemText primary={translate("map_style")} />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("vehicles")}>
                        <ListItemText primary={translate("displaying_vehicles")} />
                        <NavigateNext />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => navigate("language")}>
                        <ListItemText primary={translate("language")} />
                        <NavigateNext />
                    </ListItemButton>
                </List>} />
                <Route path="city" element={<List>
                    {Object.keys(cities).map<React.ReactNode>((city) => (<ListItemButton onClick={() => {
                        localStorage.setItem("city", city);
                        toast.success(translate("city_changed", cities[city as City].name));
                        navigate(`/${city}`);
                    }}>
                        <ListItemText primary={cities[city as City].name} />
                        <NavigateNext />
                    </ListItemButton>)).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])}
                </List>} />
                <Route path="style" element={<FormControl>
                    <FormLabel><Translate name="map_style" /></FormLabel>
                    <RadioGroup
                        value={mapStyle}
                        onChange={({ target }) => setMapStyle(target.value as MapStyle)}
                    >
                        <FormControlLabel value="gmaps" control={<Radio />} label="Google Maps" />
                        <FormControlLabel value="gsat" control={<Radio />} label="Google Satelitte" />
                        <FormControlLabel value="osm" control={<Radio />} label="Open Street Map" />
                        <FormControlLabel value="mapbox" control={<Radio />} label="Mapbox" />
                        <FormControlLabel value="mapstr" control={<Radio />} label="Mapbox Streets" />
                        <FormControlLabel value="mapnav" control={<Radio />} label="Mapbox Navigation" />
                        <FormControlLabel value="mapsat" control={<Radio />} label="Mapbox Satelitte" />
                    </RadioGroup>
                </FormControl>} />
                <Route path="vehicles" element={<>
                    <input type="checkbox" checked onChange={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")} /> Wyświetlać pojazdy?
                </>} />
                <Route path="language" element={<List>
                    {Object.values(languages).map<React.ReactNode>((lang) => (<ListItemButton onClick={() => {
                        localStorage.setItem("lang", lang.meta_code);
                        toast.success(translate("language_changed", lang.meta_name));
                        navigate("/");
                    }}>
                        <ListItemIcon><img src={lang.meta_img} alt={lang.meta_code} width="25" height="25" /></ListItemIcon>
                        <ListItemText primary={lang.meta_name} />
                        <NavigateNext />
                    </ListItemButton>)).reduce((prev, curr, i) => [prev, <Divider key={`x${i}`} />, curr])}
                </List>} />
            </Routes>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => navigate("/")} variant="outlined"><Translate name="cancel" /></Button>
            <Button onClick={() => {
                localStorage.setItem("mapstyle", mapStyle);
                toast.success(translate("settings_saved"));
                navigate("/");
            }} variant="contained" color="success"><Translate name="save" /></Button>
        </DialogActions>
    </Dialog>;
};