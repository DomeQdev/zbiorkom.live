import React, { useEffect, useMemo, useState } from "react";
import { List, Divider, ListItemButton, ListItemText, ListItemAvatar } from "@mui/material";
import { City, Departure, Stop, Vehicle } from "../util/typings";
import { useNavigate, useParams } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { toast } from "react-toastify";
import { useMap } from "react-leaflet";
import { translate, Translate } from "../util/Translations";
import VehicleMarker from "../components/VehicleMarker";
import StopMarker from "../components/StopMarker";
import cities from "../util/cities.json";
import icons from "../util/icons";

export default ({ city, stops, vehicles }: { city: City, stops: Stop[], vehicles: Vehicle[] }) => {
    const navigate = useNavigate();
    const map = useMap();
    const { id } = useParams();

    const [stop, setStop] = useState<Stop>();
    const [departures, setDepartures] = useState<Departure[]>([]);

    useEffect(() => {
        if (!stops.length || stop) return;
        let st = stops.find(s => s.id === id);
        if (!st) {
            toast.error(translate("stop_not_found"));
            return navigate(`/${city}`);
        }
        setStop(st);
        map.setView(st.location, 17);
        const loadDepartures = () => fetch(cities[city].api.stopDepartures!.replace("{{stop}}", st!.id)).then(res => res.json()).then(setDepartures);
        loadDepartures();
        setInterval(() => document.visibilityState === "visible" ? loadDepartures() : null, 60000 * 2);
    }, [stops]);

    const dep = useMemo(() => departures.map(departure => {
        let vehicle = vehicles.find(v => v.line === departure.line && v.brigade === departure.brigade);
        return {
            ...departure,
            vehicle,
            realTime: vehicle ? departure.scheduledTime + (vehicle.delay || 0) * 1000 : departure.realTime,
            delay: Math.floor((vehicle?.delay || departure.delay) / 60)
        };
    }), [departures, vehicles]);

    return <>
        {stop ? <StopMarker stop={stop} color="#ff0000" /> : null}
        {dep.filter(veh => veh.vehicle).map((veh, i) => <VehicleMarker vehicle={veh.vehicle!} city={city} key={`0_${i}`} />)}
        <BottomSheet
            open
            onDismiss={() => navigate(`/${city}`)}
            blocking={false}
            style={{ zIndex: 1000, position: "absolute" }}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
            header={<b style={{ alignItems: "center" }}>{stop?.name}</b>}
        >
            {dep.filter(x => Date.now() - 70000 < x.realTime).length ? <List>{dep.filter(x => Date.now() - 70000 < x.realTime).sort((a, b) => a.realTime - b.realTime).map<React.ReactNode>((departure, i) => (
                <ListItemButton key={`1_${i}`} onClick={() => departure?.vehicle ? map.setView(departure.vehicle.location, 17) : null}>
                    <ListItemText>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <span style={{ display: "inline-flex" }}><b style={{ color: "white", backgroundColor: departure?.color, borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center", height: 15 }}>{icons({ size: 17 })[departure?.type].icon}&nbsp;{departure?.line}</b>&nbsp;{departure?.headsign}</span>
                                <span style={{ fontSize: 15 }}><br />{departure.delay ? <b style={{ color: "#d1312a" }}><Translate name={departure.delay > 0 ? "delayed" : "before_time"} replace={`${Math.abs(departure.delay)} min`} /></b> : <b style={{ color: "#187d3c" }}><Translate name="on_time" /></b>} <b>&#183;</b> {departure.delay ? <s>{timeString(departure.scheduledTime)}</s> : null} {timeString(departure.realTime)}</span>
                            </div>
                            <div className={minutesUntil(departure.realTime) < 0.3 ? "odjezdza" : ""}>
                                <p style={{ fontSize: 20, margin: 0, lineHeight: 1.2, textAlign: "right" }}>{minutesUntil(departure.realTime) < 0.5 ? "<1" : minutesUntil(departure.realTime)}</p>
                                <span style={{ color: "#737478", fontSize: 13, lineHeight: 0, margin: 0, textAlign: "right" }}>min</span>
                            </div>
                        </div>
                    </ListItemText>
                </ListItemButton>
            )).reduce((prev, curr, i) => [prev, <Divider key={`2_${i}`} sx={{ backgroundColor: "#DCCDCD", marginLeft: "10px", marginRight: "10px" }} />, curr])}</List> : <h2 style={{ textAlign: "center" }}>Już dzisiaj nic tu nie przyjedzie :(</h2>}
        </BottomSheet>
    </>;
};

function minutesUntil(timestamp: number) {
    return Math.round((timestamp - Date.now()) / 60000);
}

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}