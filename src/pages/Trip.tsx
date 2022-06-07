import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Vehicle, City, Trip } from "../util/typings";
import { Polyline, useMap } from "react-leaflet";
import { toast } from "react-toastify";
import { translate } from "../util/Translations";
import { Result, TripInfo } from "../util/Realtime";
import VehicleMarker from "../components/VehicleMarker";
import StopMarker from "../components/StopMarker";
import BottomSheet from "../components/BottomSheet";
import Brigade from "./Brigade";
import VehicleInfo from "./VehicleInfo";
import cities from "../util/cities.json";
import Alerts from "./Alerts";

export default ({ vehicles, city }: {
    vehicles: Vehicle[],
    city: City
}) => {
    const navigate = useNavigate();
    const map = useMap();
    const { type, tab } = useParams<{ type: "bus" | "tram" | "km" | "skm" | "wkd" | "metro", tab: string }>();
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [trip, setTrip] = useState<Trip>();
    const [tripInfo, setTripInfo] = useState<Result>();
    const [follow, setFollow] = useState(true);

    useEffect(() => {
        if (!vehicles.length) return;

        let veh = vehicles.find(v => v.type === type && v.tab === tab);
        if (!veh) {
            toast.error(translate(vehicle ? "vehicle_lost" : "vehicle_not_found"));
            return navigate(`/${city}`);
        }
        if ((veh && !vehicle) || follow) map.setView(veh.location, 17);
        setVehicle(veh);

        //@ts-ignore
        if (!veh?.trip && !vehicle?.trip) return setTrip({ error: true });

        if (!trip?.error && veh?.trip && (!trip || trip.id !== veh.trip)) fetch(cities[city].api.trip.replace("{{trip}}", encodeURIComponent(veh.trip))).then(res => res.json())
            .then(setTrip)
            .catch(() => {
                toast.error(translate("fatal_error"));
                return navigate(`/${city}`);
            });
    }, [vehicles]);

    map.on("drag", () => setFollow(false));

    useEffect(() => {
        if (!trip?.stops) return;
        setTripInfo(TripInfo({
            shapes: trip.shapes,
            stops: trip.stops,
            location: vehicle?.location,
            delay: vehicle?.delay
        }));
    }, [vehicle, trip]);

    return <>
        {vehicle && <VehicleMarker vehicle={vehicle} city={city} trip />}
        {trip?.shapes && <Polyline positions={trip.shapes} pathOptions={{ color: trip.color, weight: 8 }} />}
        {trip?.stops && trip.stops.map((stop, i) => <StopMarker stop={stop} color={trip?.color} key={i} />)}
        <BottomSheet trip={trip} vehicle={vehicle} city={city} tripInfo={tripInfo} />
        {vehicle?.brigade && <Routes>
            <Route path="brigade" element={<Brigade city={city} vehicle={vehicle} />} />
            <Route path="vehicle" element={<VehicleInfo city={city} vehicle={vehicle} />} />
            {trip?.alerts?.length && <Route path="alerts" element={<Alerts alerts={trip.alerts} />} />}
        </Routes>}
    </>;
};