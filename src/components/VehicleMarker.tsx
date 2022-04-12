import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Vehicle, City } from "../util/typings";
import icons from "../util/icons";
import { ArrowUpward, DirectionsBus, Tram, DirectionsTransit, DirectionsRailway, Subway, Train } from '@mui/icons-material';

export default ({ vehicle, city, trip }: {
    vehicle: Vehicle,
    city: City
    trip?: boolean
}) => {
    const navigate = useNavigate();

    const icon = divIcon({
        className: 'vehicle',
        html: renderToStaticMarkup(<span className={`vehicle-marker`} style={{ color: icons({})[vehicle.type]?.color, border: `2px solid ${icons({})[vehicle.type]?.color}`, fill: icons({})[vehicle.type]?.color }}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}{icons({ size: 20 })[vehicle.type]?.icon}&nbsp;<b className={"line-number"}>{vehicle.line}</b>{vehicle?.brigade ? <small>/{vehicle.brigade}</small> : null}</span>),
        //@ts-ignore
        iconSize: ["auto", "auto"]
    });

    return <Marker position={vehicle.location} icon={icon} eventHandlers={{
        click: () => !trip ? navigate(`/${city}/${vehicle.type}/${vehicle.tab}`) : null
    }}>
    </Marker>;
};