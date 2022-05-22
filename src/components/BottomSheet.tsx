import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LatLngBoundsExpression } from "leaflet";
import { useMap } from "react-leaflet";
import { Vehicle, City, Trip } from "../util/typings";
import { Translate } from "../util/Translations";
import StopList from "./StopList";
import icons from "../util/icons";
import cities from "../util/cities.json";

export default ({ trip, vehicle, city }: { trip?: Trip, vehicle?: Vehicle, city: City }) => {
    const navigate = useNavigate();
    const map = useMap();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return <BottomSheet
        open
        onDismiss={() => navigate(`/${city}`)}
        blocking={false}
        style={{ zIndex: 1000, position: "absolute" }}
        snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        header={<div style={{ display: "flex", justifyContent: "space-between" }}>
            <div />
            <div style={{ display: "inline-flex", alignItems: "center" }}>
                <b style={{ color: "white", backgroundColor: trip?.color || "#880077", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}>{icons({ size: 18 })[vehicle?.type!]?.icon}&nbsp;{vehicle?.line}</b>{vehicle?.headsign || trip?.headsign ? <>&nbsp;{vehicle?.headsign || trip?.headsign}</> : null}
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
                    {trip?.shapes && <MenuItem onClick={() => { if (trip?.shapes) map.fitBounds(bounds(trip.shapes)); setAnchorEl(null); }}><Translate name="show_route" /></MenuItem>}
                    {cities[city].functions.brigades && vehicle?.brigade && <MenuItem onClick={() => { navigate("brigade"); setAnchorEl(null); }}><Translate name="next_trips" /></MenuItem>}
                    {cities[city].functions.vehicleInfo && vehicle?.brigade && <MenuItem onClick={() => { navigate("vehicle"); setAnchorEl(null); }}><Translate name="vehicle_info" /></MenuItem>}
                    <MenuItem onClick={() => navigate(`/${city}`)}><Translate name="close" /></MenuItem>
                </Menu>
            </div>
        </div>}
    >
        {trip?.error ? <h3 style={{ textAlign: "center" }}><Translate name="trip_not_found" /></h3> : <StopList trip={trip} vehicle={vehicle} />}
    </BottomSheet>;
};

function bounds(shapes: [number, number][]) {
    const minLat = Math.min(...shapes.map(x => x[0]));
    const maxLat = Math.max(...shapes.map(x => x[0]));
    const minLng = Math.min(...shapes.map(x => x[1]));
    const maxLng = Math.max(...shapes.map(x => x[1]));
    return [[minLat, minLng], [maxLat, maxLng]] as LatLngBoundsExpression;
}