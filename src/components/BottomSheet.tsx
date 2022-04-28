import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Vehicle, City, Trip } from "../util/typings";
import StopList from "./StopList";
import icons from "../util/icons";
import cities from "../util/cities.json";

export default ({ trip, vehicle, city }: { trip?: Trip, vehicle?: Vehicle, city: City }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return <BottomSheet
        open
        onDismiss={() => navigate(`/${city}`)}
        blocking={false}
        style={{ zIndex: 1000, position: "absolute" }}
        snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        header={<>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
                <b style={{ color: "white", backgroundColor: trip?.color || "#880077", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}>{icons({ size: 18 })[vehicle?.type!]?.icon}&nbsp;{vehicle?.line}</b>{vehicle?.headsign || trip?.headsign ? <>&nbsp;{vehicle?.headsign || trip?.headsign}</> : null}
            </div>
            <IconButton style={{ right: 15, position: "absolute" }} onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? null : currentTarget)}><MoreVert /></IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                style={{ zIndex: 300000 }}
                PaperProps={{
                    style: {
                        maxHeight: 40 * 4.5,
                        width: 'auto',
                    }
                }}
            >
                <MenuItem>Pokaż trasę</MenuItem>
                {cities[city].functions.brigades && vehicle?.brigade && <MenuItem onClick={() => { navigate("brigade"); setAnchorEl(null); }}>Kursy tego pojazdu</MenuItem>}
                {cities[city].functions.vehicleInfo && <MenuItem onClick={() => { navigate("vehicle"); setAnchorEl(null); }}>Informacje o pojeździe</MenuItem>}
            </Menu>
        </>}
    >
        {trip?.error ? <h3 style={{ textAlign: "center" }}>Nie znaleziono trasy</h3> : <StopList trip={trip} vehicle={vehicle} />}
    </BottomSheet>;
};