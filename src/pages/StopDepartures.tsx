import { useEffect, useMemo, useState } from "react";
import { List, Divider, ListItemButton, ListItemText, IconButton, Badge, Menu, MenuItem } from "@mui/material";
import { Close, MoreVert } from "@mui/icons-material";
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

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
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

        const loadDepartures = () => fetch(cities[city].api.stopDepartures!.replace("{{stop}}", st!.id)).then(res => res.json()).then(res => {
            if (res.error) {
                toast.error(res.error);
                return navigate(`/${city}`);
            }
            setDepartures(res.departures);
        });
        loadDepartures();

        const int = setInterval(() => document.visibilityState === "visible" ? loadDepartures() : null, 20000);
        return () => clearInterval(int);
    }, [stops]);

    const dep = useMemo(() => departures.map(departure => {
        let vehicle = vehicles.find(v => v.trip === departure.trip || (v.line === departure.line && departure.brigade && v.brigade === departure.brigade));
        return {
            ...departure,
            vehicle,
            delay: Math.floor(departure.delay / 60)
        };
    }), [departures, vehicles]);

    return <>
        {stop ? <StopMarker stop={stop} color="#ff0000" key={stop.id} /> : null}
        {dep.filter(veh => veh.vehicle).filter((value, index, self) => index === self.findIndex((t) => t.trip === value.trip || (t.line === value.line && t.brigade && t.brigade === value.brigade))).map((veh) => <VehicleMarker vehicle={veh.vehicle!} city={city} key={`${veh.type}${veh.vehicle?.tab}`} />)}
        <BottomSheet
            open
            onDismiss={() => navigate(`/${city}`)}
            blocking={false}
            style={{ zIndex: 1000, position: "absolute" }}
            snapPoints={({ maxHeight }) => [maxHeight / 3.7, maxHeight * 0.6, maxHeight - 40]}
            header={<div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton onClick={() => navigate(`/${city}`)}><Close /></IconButton>
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <b style={{ alignItems: "center" }}>{stop?.name}</b>
                </div>
                <div><IconButton onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? null : currentTarget)}><MoreVert /></IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={!!anchorEl}
                        onClose={() => setAnchorEl(null)}
                        style={{ zIndex: 300000 }}
                        PaperProps={{
                            style: {
                                maxHeight: 40 * 4.5,
                                minWidth: 30 * 4.5,
                            }
                        }}
                    >
                        <MenuItem><Close style={{ width: 20, height: 20 }} color="primary" />&nbsp;Ghost</MenuItem>
                    </Menu>
                </div>
            </div>}
        >
            {dep.length ? <List>{dep.sort((a, b) => a.realTime - b.realTime).map<React.ReactNode>((departure, i) => (
                <ListItemButton key={i} onClick={() => departure.vehicle ? map.setView(departure.vehicle.location, 17) : null} sx={{ opacity: Date.now() - 30000 < departure.realTime ? 1 : 0.5 }}>
                    <ListItemText>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <span style={{ display: "inline-flex" }}><b style={{ color: "white", backgroundColor: departure?.color, borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center", height: 15 }}>{icons({ size: 17 })[departure.type].icon}&nbsp;{departure.line.replace("-", "")}{departure.brigade && <small style={{ fontSize: 11 }}>/{departure.brigade}</small>}</b>&nbsp;{departure.headsign}</span>
                                <span style={{ fontSize: 15 }}><br />{departure.vehicle ? (departure.trip === departure.vehicle.trip ? <>{departure.delay ? <b style={{ color: "#d1312a" }}><Translate name={departure.delay > 0 ? "delayed" : "before_time"} replace={`${Math.abs(departure.delay)} min`} /></b> : <b style={{ color: "#187d3c" }}><Translate name="on_time" /></b>} {departure.platform ? <><b>&#183;</b> <Translate name="platform" /> <b>{departure.platform}</b></> : null}</> : <b><Translate name="early_trip" replace={departure.vehicle.headsign} /></b>) : <b><Translate name="scheduled" /></b>}</span>
                            </div>
                            <div>
                                {minutesUntil(departure.realTime) < 60 && Date.now() - 30000 < departure.realTime && <p style={{ margin: 0, lineHeight: 1.4, textAlign: "right" }}><span style={{ fontSize: 20, fontWeight: "bold" }}>{minutesUntil(departure.realTime) < 0.5 ? "<1" : minutesUntil(departure.realTime)}</span> min</p>}
                                <p style={{ color: "#737478", fontSize: 14, margin: 0, lineHeight: 1.4, textAlign: "right" }}>{departure.delay ? <s>{timeString(departure.scheduledTime)}</s> : null} {timeString(departure.realTime)}</p>
                            </div>
                        </div>
                    </ListItemText>
                </ListItemButton>
            )).reduce((prev, curr, i) => [prev, <Divider key={`2_${i}`} sx={{ backgroundColor: "#DCCDCD", marginLeft: "10px", marginRight: "10px" }} />, curr])}</List> : <h2 style={{ textAlign: "center" }}>🦗🦗🦗🦗🦗🦗</h2>}
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