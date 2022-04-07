import { useState } from "react";
import { GpsFixed, Settings, FilterList } from '@mui/icons-material';
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

export default ({ city, children }: {
    children?: JSX.Element | JSX.Element[],
    city?: "warsaw" | "gdansk"
}) => {
    const navigate = useNavigate();
    const [map, setMap] = useState(null);

    return <MapContainer
        center={city === "warsaw" ? [52.22983095298667, 21.0117354814593] : [54.34610966679864, 18.644629872390432]}
        zoom={16}
        minZoom={6}
        maxZoom={18}
        zoomControl={false}
        whenCreated={setMap}
        style={{ width: "100%", height: "100vh" }}
    >
        <TileLayer url={"https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"} />
        <ZoomControl position="topright" />
        <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 80, right: 10, position: "absolute" }}>
            <a href="/where_tf_i_am" onClick={e => { e.preventDefault(); }}><GpsFixed sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
        </div>
        <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 120, right: 10, position: "absolute" }}>
            <a href="/jebac_konstale_daj_mnie_swingi" onClick={e => { navigate("/filter"); e.preventDefault(); }}><FilterList sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
            <a href="/i_want_dark_mode_uwu" onClick={e => { navigate("/settings"); e.preventDefault(); }}><Settings sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
        </div>
        {children}
    </MapContainer>;
};