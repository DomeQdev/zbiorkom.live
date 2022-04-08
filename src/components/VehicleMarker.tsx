import { divIcon, LatLngExpression } from 'leaflet';
import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ArrowUpward, DirectionsBus, Tram, DirectionsTransit, DirectionsRailway, Subway, Train } from '@mui/icons-material';

const types = {
    bus: {
        icon: <DirectionsBus style={{ height: "20px", width: "20px" }} />,
        color: "#006b47"
    },
    tram: {
        icon: <Tram style={{ height: "20px", width: "20px" }} />,
        color: "#007bff"
    },
    metro: {
        icon: <Subway style={{ height: "20px", width: "20px" }} />,
        color: ""
    },
    wkd: {
        icon: <DirectionsRailway style={{ height: "20px", width: "20px" }} />,
        color: ""
    },
    skm: {
        icon: <Train style={{ height: "20px", width: "20px" }} />,
        color: "#009955"
    },
    km: {
        icon: <DirectionsTransit style={{ height: "20px", width: "20px" }} />,
        color: "#0A6F0A"
    },
    troley: {
        icon: <DirectionsBus style={{ height: "20px", width: "20px" }} />,
        color: "#009955"
    }
};

export default ({ vehicle, city }: {
    vehicle: {
        brigade: String,
        deg: Number | null,
        lastPing: Date,
        line: String,
        location: LatLngExpression,
        tab: String,
        trip?: String,
        type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "troley"
    },
    city: "warsaw" | "gdansk"
}) => {
    const navigate = useNavigate();

    const icon = divIcon({
        className: 'vehicle',
        html: renderToStaticMarkup(<span className={`vehicle-marker`} style={{ color: types[vehicle.type].color, border: `2px solid ${types[vehicle.type].color}`, fill: types[vehicle.type].color }}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}{types[vehicle.type].icon}&nbsp;<b className={"line-number"}>{vehicle.line}</b>{vehicle?.brigade ? <small>/{vehicle.brigade}</small> : null}</span>),
        //@ts-ignore
        iconSize: ["auto", "auto"]
    })

    return <Marker position={vehicle.location} icon={icon} eventHandlers={{
        click: () => navigate(`/${city}/${vehicle.type}/${vehicle.tab}`)
    }} />;
};