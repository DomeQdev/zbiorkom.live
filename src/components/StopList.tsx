import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { MoreVert, PanTool } from "@mui/icons-material";
import { nearestPointOnLine, point, lineString, Position } from "@turf/turf";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Stop, Trip, Vehicle } from "../util/typings";

export default ({ trip, vehicle }: { trip?: Trip, vehicle?: Vehicle }) => {
    const map = useMap();
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => setScrolled(false), [trip]);

    const lastStop = trip?.stops?.filter(stop => metersToStop(stop) < -50)?.pop();
    const serving = trip?.stops?.find(stop => metersToStop(stop) < 50 && metersToStop(stop) > -50);
    const nextStop = trip?.stops?.filter(stop => metersToStop(stop) > 50)?.shift();
    const tripStart = lastStop || !trip || trip.error ? 0 : minutesUntil(trip.stops[0].departure);

    return <List>
        {trip?.stops?.map<React.ReactNode>((stop, i) => (
            <ListItem button key={stop.name} onClick={() => map.setView(stop.location, 17)} ref={(ref) => {
                if (!scrolled && trip.stops.filter(st => metersToStop(st) > -50)[0]?.id === stop.id) {
                    ref?.scrollIntoView();
                    setScrolled(true);
                }
            }}>
                <ListItemAvatar>
                    <Avatar sx={{ width: 15, height: 15, backgroundColor: metersToStop(stop) > -50 ? trip?.color : "#9ba1ab", color: "white", marginLeft: "5px", zIndex: 30000 }}>&nbsp;</Avatar>
                    {i + 1 !== trip.stops?.length ? <div style={{ borderLeft: `7px solid ${metersToStop(stop) > -50 || (nextStop === trip.stops[i + 1] && !serving) ? trip?.color : "#9ba1ab"}`, marginLeft: '9px', marginTop: '-1px', height: '100%', position: 'absolute', paddingRight: '16px' }} /> : null}
                </ListItemAvatar>
                <ListItemText>
                    <div style={{ float: "left", textAlign: "left", color: metersToStop(stop) < -50 ? "#ADADAD" : "" }}>
                        {stop.on_request ? <PanTool style={{ width: "15px", height: "15px" }} /> : null} {stop.name}
                    </div>
                    <div style={{ float: "right", textAlign: "right" }}>
                        {metersToStop(stop) > -50 ? Math.floor(tripStart + stop.time - (lastStop?.time || 0)) + "'" : null}
                    </div>
                </ListItemText>
            </ListItem>
        )).reduce((prev, curr) => [prev, <Divider variant="inset" key={Math.random()} sx={{ backgroundColor: "#DCCDCD", marginRight: "10px" }} />, curr])}
    </List>;

    function metersToStop(stop: Stop) {
        return trip ? stop.onLine - (nearestPointOnLine(lineString(trip.shapes as Position[]), point(vehicle?.location as Position), { units: 'meters' }).properties.location || 0) : 0;
    }
};

function minutesUntil(timestamp: number) {
    return (timestamp - Date.now()) / 60000;
}