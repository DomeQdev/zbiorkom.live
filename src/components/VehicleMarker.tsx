import { divIcon, LatLngExpression } from 'leaflet';
import { Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";

export default ({ vehicle, city }: {
    vehicle: {
        brigade: String,
        deg: Number | null,
        lastPing: Date,
        line: String,
        location: LatLngExpression,
        tab: String,
        trip?: String,
        type: "bus" | "tram" | "trolley" | "skm" | "km" | "wkd" | "metro"
    },
    city: "warsaw" | "gdansk"
}) => {
    const navigate = useNavigate();

    return <Marker position={vehicle.location} icon={divIcon({
        className: "",
        html: "",
    })} eventHandlers={{
        click: () => navigate(`/${city}/${vehicle.type}/${vehicle.tab}`)
    }} />;
};