import { useState } from "react";
import { LatLngExpression, Map } from "leaflet";
import { City, MapStyle } from "../util/typings";
import { GpsFixed, Settings, FilterList } from '@mui/icons-material';
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import UserMarker from "./UserMarker";
import cities from "../util/cities.json";

export default ({ city, children }: {
    children?: JSX.Element | JSX.Element[],
    city: City
}) => {
    const navigate = useNavigate();
    const [map, setMap] = useState<Map>();
    const [userLocation, setUserLocation] = useState<any>();
    const [userAngle, setUserAngle] = useState<any>();

    window.addEventListener("deviceorientation", ({ alpha }) => setUserAngle(alpha || 0));

    return <MapContainer
        center={cities[city].location as LatLngExpression}
        zoom={16}
        minZoom={6}
        maxZoom={18}
        zoomControl={false}
        whenCreated={setMap}
        style={{ width: "100%", height: "100vh" }}
    >
        <TileLayer url={MapStyle()} />
        <ZoomControl position="topright" />
        <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 80, right: 10, position: "absolute" }}>
            <a href="/" onClick={e => { locate(); e.preventDefault(); }}><GpsFixed sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
        </div>
        <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 120, right: 10, position: "absolute" }}>
            {cities[city].functions.filter && <a href="/" onClick={e => { navigate(`/${city}/filter`); e.preventDefault(); }}><FilterList sx={{ fontSize: 19, marginTop: 0.75 }} /></a>}
            <a href="/" onClick={e => { navigate("/settings"); e.preventDefault(); }}><Settings sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
        </div>
        {children}
        {userLocation && <UserMarker location={userLocation.latlng} angle={userAngle} />}
    </MapContainer>;

    function locate() {
        if (!map) return;
        if (userLocation) return map.setView(userLocation.latlng, 17);
        map.locate({ watch: true })
            .once("locationfound", ({ latlng }) => map.setView(latlng, 17))
            .on("locationfound", setUserLocation);
    };

    function MapStyle() {
        switch (localStorage.getItem("mapstyle") as MapStyle) {
            case "osm": 
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            case "mapbox":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsbx3mn001s14pape9nn2qq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapstr":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc7ufs000e15mrqldtaa15/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapsat":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc8506000215jqervcjkbk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "mapnav":
                return "https://api.mapbox.com/styles/v1/domeq/ckzsc8ra900qs14l84la2zfpk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JlOWZ3MGx3cjJubW9zNDc5eGpwdiJ9.nUlvFKfUzpxBxJVc4zmAMA";
            case "gmaps":
                return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
            case "gsat":
                return "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
            default:
                return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
        };
    };
};