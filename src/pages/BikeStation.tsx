import { ListItem, ListItemText, Divider } from "@mui/material";
import { Bikes, City } from "../util/typings";
import { translate } from "../util/Translations";
import { useNavigate, useParams } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMap } from "react-leaflet";
import { DirectionsBike, PedalBike } from "@mui/icons-material";
import BikeMarker from "../components/BikeMarker";

export default ({ bikes, city }: { bikes: Bikes[], city: City }) => {
    const navigate = useNavigate();
    const map = useMap();
    const { id } = useParams();
    const [bike, setBike] = useState<Bikes>();

    useEffect(() => {
        if (!bikes.length) return;
        let _bike = bikes.find(x => x.id === id);
        if (!_bike) {
            toast.error(translate("bike_station_not_found"));
            return navigate(`/${city}`);
        }
        if (!bike) map.setView(_bike.location, 17);
        setBike(_bike);
    }, [bikes]);

    return <>
        {bike && <BikeMarker bike={bike} key={bike.id} />}
        <BottomSheet
            open
            onDismiss={() => navigate(`/${city}`)}
            blocking={false}
            style={{ zIndex: 1000, position: "absolute" }}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
            header={bike && <>
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ color: "white", backgroundColor: "#104a9e", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}><DirectionsBike style={{ width: 18, height: 18 }} />&nbsp;{bike?.id}</span>&nbsp;{bike?.name}
                </div>
                <br />
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <PedalBike />&nbsp;<b style={{ fontSize: 18 }}>{bike.bike_racks - bike.free_racks}</b> / <span>{bike?.bike_racks}</span>
                </div>
            </>}
        >
            {bike?.bikes.length ? bike.bikes.sort((a, b) => a.number - b.number).map<React.ReactNode>((bik, i) => <ListItem key={`0_${i}`}>
                <ListItemText>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <span style={{ display: "inline-flex" }}><span style={{ color: "white", backgroundColor: "#104a9e", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center", height: 15 }}><DirectionsBike style={{ width: 18, height: 18 }} />&nbsp;{bik.number}</span>&nbsp;{bik.name}</span>
                        </div>
                    </div>
                </ListItemText>
            </ListItem>).reduce((prev, curr, i) => [prev, <Divider key={`1_${i}`} sx={{ backgroundColor: "#DCCDCD", marginLeft: "10px", marginRight: "10px" }} />, curr]) : "😨❌🚲❌"}
        </BottomSheet>
    </>;
};