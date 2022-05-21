import { List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Trip, Vehicle } from "../util/typings";
import { Translate } from "../util/Translations";
import { Result, TripInfo } from "../util/Realtime";

export default ({ trip, vehicle }: { trip?: Trip, vehicle?: Vehicle }) => {
    const map = useMap();
    const [scrolled, setScrolled] = useState(false);
    const [tripInfo, setTripInfo] = useState<Result>();

    useEffect(() => setScrolled(false), [trip]);
    useEffect(() => {
        if (!trip?.stops) return;
        setTripInfo(TripInfo({
            shapes: trip.shapes,
            stops: trip.stops,
            location: vehicle?.location
        }))
    }, [vehicle, trip]);

    return <List>
        {tripInfo?.stops?.map<React.ReactNode>((stop, i) => (
            <ListItemButton key={stop.name} onClick={() => map.setView(stop.location, 17)} ref={(ref) => {
                if (!scrolled && (tripInfo?.serving?.id === stop?.id || (tripInfo?.nextStop.id === stop?.id && !tripInfo?.serving))) {
                    ref?.scrollIntoView();
                    setScrolled(true);
                }
            }}>
                <ListItemAvatar>
                    <Avatar sx={{ width: 15, height: 15, backgroundColor: stop?.metersToStop > -50 ? trip?.color : "#9ba1ab", color: "white", marginLeft: "5px", zIndex: 30000 }}>&nbsp;</Avatar>
                    {i + 1 !== tripInfo?.stops?.length ? <div style={{ borderLeft: `7px solid ${stop?.metersToStop > -50 || (tripInfo?.nextStop?.id === tripInfo?.stops[i + 1]?.id) ? trip?.color : "#9ba1ab"}`, marginLeft: '9px', marginTop: '-1px', height: '100%', position: 'absolute', paddingRight: '16px' }} /> : null}
                </ListItemAvatar>
                <ListItemText style={{ marginLeft: "-13px", marginRight: "1px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: stop?.metersToStop < -50 ? "#ADADAD" : "" }}>
                            <span>{stop.name}</span>
                            {stop?.metersToStop > -50 ? <span style={{ fontSize: 15 }}><br />{tripInfo?.delay ? <b style={{ color: "#d1312a" }}><Translate name={tripInfo?.delay > 0 ? "delayed" : "before_time"} replace={`${Math.abs(tripInfo?.delay)} min`} /></b> : <b style={{ color: "#187d3c" }}><Translate name="on_time" /></b>} <b>&#183;</b> {tripInfo?.delay ? <s>{timeString(stop.arrival)}</s> : null} {timeString(stop.arrival + (tripInfo?.delay || 0) * 60000)}</span> : null} {stop.platform ? <><b>&#183;</b> <Translate name="platform" /> <b>{stop.platform}</b></> : null}
                        </div>
                        {stop?.metersToStop > -50 && minutesUntil(stop.arrival + (tripInfo?.delay || 0) * 60000) < 60 ? <div>
                            <p style={{ fontSize: 20, margin: 0, lineHeight: 1.2, textAlign: "right" }}>{minutesUntil(stop.arrival + (tripInfo?.delay || 0) * 60000) < 0.5 ? "<1" : minutesUntil(stop.arrival + (tripInfo?.delay || 0) * 60000)}</p>
                            <span style={{ color: "#737478", fontSize: 13, lineHeight: 0, margin: 0, textAlign: "right" }}>min</span>
                        </div> : null}
                    </div>
                </ListItemText>
            </ListItemButton>
        )).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={i} sx={{ backgroundColor: "#DCCDCD", marginRight: "10px", marginLeft: "57px" }} />, curr])}
    </List>;
};

function minutesUntil(timestamp: number) {
    return Math.round((timestamp - Date.now()) / 60000);
}

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}
