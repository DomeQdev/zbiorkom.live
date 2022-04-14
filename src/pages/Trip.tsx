import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicle, City, Trip } from "../util/typings";
import { Polyline, useMap } from "react-leaflet";
import { toast } from "react-toastify";
import VehicleMarker from "../components/VehicleMarker";
import StopMarker from "../components/StopMarker";
import BottomSheet from "../components/BottomSheet";

export default ({ vehicles, city }: {
    vehicles: Vehicle[],
    city: City
}) => {
    const navigate = useNavigate();
    const map = useMap();
    const { type, tab } = useParams<{ type: "bus" | "tram" | "km" | "skm" | "wkd" | "metro", tab: string }>();
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [trip, setTrip] = useState<Trip>();

    useEffect(() => {
        if (!vehicles.length) return;

        let veh = vehicles.find(v => v.type === type && v.tab === tab);
        if (!veh) {
            toast.error("Nie znaleziono pojazdu.");
            return navigate(`/${city}`);
        }
        if(veh && !vehicle) map.setView(veh.location, 17);
        setVehicle(veh);

        if (!trip?.error && veh?.trip && (!trip || trip.id !== veh.trip)) fetch(`/api/${city}/trip?trip=0${veh.trip}`).then(res => res.json()).then(setTrip).catch(e => {
            toast.error("Fatalny błąd.");
            console.log(e.message)
        });
    }, [vehicles]);

    return <>
        {vehicle && <VehicleMarker vehicle={vehicle} city={city} trip />}
        {trip?.shapes && <Polyline positions={trip.shapes} pathOptions={{ color: trip.color, weight: 8 }} />}
        {trip?.stops && trip.stops.map(stop => <StopMarker stop={stop} color={trip?.color} key={stop.id} />)}
        <BottomSheet trip={trip} vehicle={vehicle} city={city} />
    </>;
};