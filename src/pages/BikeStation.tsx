import { Bikes, City } from "../util/typings";
import { translate, Translate } from "../util/Translations";
import { useNavigate, useParams } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DirectionsBike, Refresh } from "@mui/icons-material";
import BikeMarker from "../components/BikeMarker";
import { IconButton } from "@mui/material";

export default ({ bikes, city }: { bikes: Bikes[], city: City }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [bike, setBike] = useState<Bikes>();

    useEffect(() => {
        if(!bikes.length) return;
        let bike = bikes.find(x => String(x.id) === id);
        if(!bike) {
            toast.error(translate("bike_station_not_found"));
            return navigate(`/${city}`);
        }
        setBike(bike);
    }, [bikes]);

    return <>
        {bike && <BikeMarker bike={bike} />}
        <BottomSheet
            open
            onDismiss={() => navigate(`/${city}`)}
            blocking={false}
            style={{ zIndex: 1000, position: "absolute" }}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
            header={<div style={{ display: "flex", justifyContent: "space-between" }}>
                <div />
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ color: "white", backgroundColor: "#104a9e", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}><DirectionsBike style={{ width: 18, height: 18 }} />&nbsp;{bike?.id}</span>&nbsp;{bike?.name}
                </div>
                <IconButton><Refresh /></IconButton>
            </div>}
        >
            {JSON.stringify(bike?.bikes)}
        </BottomSheet>
    </>;
};