import { IconButton } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Vehicle, City, Trip } from "../util/typings";
import icons from "../util/icons";
import StopList from "./StopList";

export default ({ trip, vehicle, city }: { trip?: Trip, vehicle?: Vehicle, city: City }) => {
    const navigate = useNavigate();

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
        <StopList trip={trip} vehicle={vehicle}  />
    </BottomSheet>;
};