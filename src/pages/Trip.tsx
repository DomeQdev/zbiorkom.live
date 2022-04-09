import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import VehicleMarker from "../components/VehicleMarker";
import { Vehicle, City } from "../typings";

export default ({ vehicles, city }: {
    vehicles: Vehicle[],
    city: City
}) => {
    const navigate = useNavigate();
    const { type, tab } = useParams<{ type: "bus" | "tram" | "km" | "skm" | "wkd" | "metro", tab: string }>();
    const [vehicle, setVehicle] = useState<Vehicle>();

    useEffect(() => {
        if (vehicles.length && !vehicle) {
            let veh = vehicles.find(v => v.type === type && v.tab === tab);
            if (!veh) {
                toast.error("Nie znaleziono pojazdu.");
                navigate(`/${city}`);
            }
            setVehicle(veh);
        }
    }, [vehicles]);

    return <>
        {vehicle && <VehicleMarker vehicle={vehicle} city={city} />}
    </>;
};