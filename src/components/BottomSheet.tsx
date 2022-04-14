import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { nearestPointOnLine, point, lineString, Position } from "@turf/turf";
import { BottomSheet } from "react-spring-bottom-sheet";
import { MoreVert, PanTool } from "@mui/icons-material";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vehicle, City, Trip, Stop } from "../util/typings";
import icons from "../util/icons";

export default ({ trip, vehicle, city }: { trip?: Trip, vehicle?: Vehicle, city: City }) => {
    const navigate = useNavigate();
    const map = useMap();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setScrolled(false), [trip]);

    const lastStop = trip?.stops?.filter(stop => metersToStop(stop) < -40)?.pop();
    const serving = trip?.stops?.find(stop => metersToStop(stop) < 40 && metersToStop(stop) > -40);
    const nextStop = trip?.stops?.filter(stop => metersToStop(stop) > 40)?.shift();

    return <BottomSheet
        open
        onDismiss={() => navigate(`/${city}`)}
        blocking={false}
        style={{ zIndex: 30000, position: "absolute" }}
        snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        header={<>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
                <b style={{ color: "white", backgroundColor: trip?.color || "#880077", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}>{icons({ size: 18 })[vehicle?.type!]?.icon}&nbsp;{vehicle?.line}</b>{trip?.headsign ? <>&nbsp;{trip.headsign}</> : null}
            </div>
            <IconButton color="default" style={{ right: 15, position: "absolute" }} component="span" onClick={() => alert("nie")}><MoreVert /></IconButton>
        </>}
    >
        {trip?.stops?.map<React.ReactNode>((stop, i) => (
            <ListItem button key={stop.name} onClick={() => map.setView(stop.location, 17)} ref={(ref) => {
                if (!scrolled && trip.stops.filter(st => metersToStop(st) > -35)[0]?.id === stop.id) {
                    ref?.scrollIntoView();
                    setScrolled(true);
                }
            }}>
                <ListItemAvatar>
                    <Avatar sx={{ width: 15, height: 15, backgroundColor: 0 > -35 ? trip?.color : "#9ba1ab", color: "white", marginLeft: "5px" }}>&nbsp;</Avatar>
                    {i + 1 !== trip.stops?.length ? <div style={{ borderLeft: `7px solid ${0 > -35 ? trip?.color : "#9ba1ab"}`, marginLeft: '9px', marginTop: '-1px', height: '100%', position: 'absolute', paddingRight: '16px' }} /> : null}
                </ListItemAvatar>
                <ListItemText>
                    {stop.name}
                </ListItemText>
            </ListItem>
        )).reduce((prev, curr) => [prev, <Divider variant="inset" key={Math.random()} sx={{ backgroundColor: "#DCCDCD", marginRight: "10px" }} />, curr])}
    </BottomSheet>;

    function metersToStop(stop: Stop) {
        return trip ? stop.onLine - (nearestPointOnLine(lineString(trip.shapes as Position[]), point(vehicle?.location as Position), { units: 'meters' }).properties.location || 0) : 0;
    }
};