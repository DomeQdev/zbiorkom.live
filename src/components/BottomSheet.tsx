import { nearestPointOnLine, point, lineString, Position } from "@turf/turf";
import { BottomSheet } from "react-spring-bottom-sheet";
import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
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

    const lastStop = trip?.stops?.filter(stop => metersToStop(stop) < -45)?.pop();
    const serving = trip?.stops?.find(stop => metersToStop(stop) < 40 && metersToStop(stop) > -40);
    const nextStop = trip?.stops?.filter(stop => metersToStop(stop) > 45)?.shift();

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
        Poprzedni przystanek: {lastStop?.name || "Pojazd znajduje się na pętli."}<br />
        Aktualny przystanek: {serving?.name || ""}<br />
        Następny przystanek: {nextStop?.name || "Koniec trasy"}
    </BottomSheet>;

    function metersToStop(stop: Stop) {
        return trip ? stop.onLine - (nearestPointOnLine(lineString(trip.shapes as Position[]), point(vehicle?.location as Position), { units: 'meters' }).properties.location || 0) : 0;
    }
};