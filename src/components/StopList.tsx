import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { PanTool } from "@mui/icons-material";
import { nearestPointOnLine, point, lineString, Position } from "@turf/turf";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Stop, Trip, Vehicle } from "../util/typings";

export default ({ trip, vehicle }: { trip?: Trip, vehicle?: Vehicle }) => {
    const map = useMap();
    const [scrolled, setScrolled] = useState(false);
    const [stops, setStops] = useState<Stop[]>();

    useEffect(() => setScrolled(false), [trip]);
    useEffect(() => {
        if (!trip?.stops) return;
        setStops(trip?.stops?.map(stop => {
            return {
                ...stop,
                metersToStop: metersToStop(stop)
            };
        }));
    }, [vehicle, trip]);

    const lastStop = stops?.filter(stop => stop?.metersToStop < -50)?.pop();
    const serving = stops?.find(stop => stop?.metersToStop < 50 && stop?.metersToStop > -50);
    const nextStop = stops?.filter(stop => stop?.metersToStop > 50)?.shift();
    const tripStart = lastStop || !trip || trip.error ? 0 : minutesUntil(trip?.stops[0].departure);

    const next = serving || nextStop;
    const toNextStop = next && lastStop ? (next.time - lastStop?.time) - ((tripStart + next.time - lastStop?.time) * (lastStop && ((nextStop === next && !serving) || serving === next) ? percentTravelled(serving || lastStop, next) : 1)) : 0;


    return <List>
        {stops?.map(stop => ({
            ...stop,
            delay: Math.round((tripStart + stop.time - (lastStop?.time || 0)) * (lastStop && ((nextStop === stop && !serving) || serving === stop) ? percentTravelled(serving || lastStop, stop) : 1) - (next === stop ? 0 : toNextStop)) - minutesUntil(stop.arrival)
        }))?.map<React.ReactNode>((stop, i) => (
            <ListItem button key={stop.name} onClick={() => map.setView(stop.location, 17)} ref={(ref) => {
                if (!scrolled && (serving?.id === stop?.id || (nextStop?.id === stop?.id && !serving))) {
                    ref?.scrollIntoView();
                    setScrolled(true);
                }
            }}>
                <ListItemAvatar>
                    <Avatar sx={{ width: 15, height: 15, backgroundColor: stop?.metersToStop > -50 ? trip?.color : "#9ba1ab", color: "white", marginLeft: "5px", zIndex: 30000 }}>&nbsp;</Avatar>
                    {i + 1 !== stops?.length ? <div style={{ borderLeft: `7px solid ${stop?.metersToStop > -50 || (nextStop === stops[i + 1] && !serving) ? trip?.color : "#9ba1ab"}`, marginLeft: '9px', marginTop: '-1px', height: '100%', position: 'absolute', paddingRight: '16px' }} /> : null}
                </ListItemAvatar>
                <ListItemText>
                    <div style={{ float: "left", textAlign: "left", color: stop?.metersToStop < -50 ? "#ADADAD" : "" }}>
                        {stop.on_request ? <PanTool style={{ width: "15px", height: "15px" }} /> : null} {stop.name}
                    </div>
                    <div style={{ float: "right", textAlign: "right" }}>
                        {stop?.metersToStop > -50 ? stop.delay ? <>za <b>{minutesUntil(stop?.arrival) + stop.delay} min (Opóźnienie: {stop.delay} min)</b></> : <>{minutesUntil(stop?.arrival)} min (na czas)</> : null}
                    </div>
                </ListItemText>
            </ListItem>
        )).reduce((prev, curr) => [prev, <Divider variant="inset" key={Math.random()} sx={{ backgroundColor: "#DCCDCD", marginRight: "10px" }} />, curr])}
    </List>;

    function metersToStop(stop: Stop) {
        return trip ? stop.onLine - (nearestPointOnLine(lineString(trip.shapes as Position[]), point(vehicle?.location as Position), { units: 'meters' }).properties.location || 0) : 0;
    }

    function percentTravelled(stop1: Stop, stop2: Stop) {
        let res = stop1.metersToStop / (stop1.metersToStop - stop2.metersToStop);
        return (res >= 1 || res === -Infinity) ? 0 : (1 - res);
    }
};

function minutesUntil(timestamp: number) {
    return Math.round((timestamp - Date.now()) / 60000);
}