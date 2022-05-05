import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { toast } from "react-toastify";
import { City, Departure, Stop, Vehicle } from "../util/typings";
import StopMarker from "../components/StopMarker";
import { useMap } from "react-leaflet";

export default ({ city, stops, vehicles }: { city: City, stops: Stop[], vehicles: Vehicle[] }) => {
    const navigate = useNavigate();
    const map = useMap();
    const { id } = useParams();

    const [stop, setStop] = useState<Stop>();
    const [departures, setDepartures] = useState<Departure[]>();

    useEffect(() => {
        if(!stops.length || stop) return;
        let st = stops.find(s => s.id === id);
        if (!st) {
            toast.error("Nie znaleziono przystanku.");
            return navigate(`/${city}`);
        }
        setStop(st);
        map.setView(st.location, 17);
    }, [stops]);

    return <>
        {stop ? <StopMarker stop={stop} color="#ff0000" /> : null}
        <BottomSheet
            open
            onDismiss={() => navigate(`/${city}`)}
            blocking={false}
            style={{ zIndex: 1000, position: "absolute" }}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
            header={<b style={{ alignItems: "center" }}>{stop?.name}</b>}
        >
            poczekaj, nasze chomiki są w trakcie przygotowywania listy przyjazdów...
        </BottomSheet>
    </>;
};