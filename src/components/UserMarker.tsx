import { divIcon, LatLngExpression } from 'leaflet';
import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import { ArrowUpward, AccountCircle } from '@mui/icons-material';

export default ({ location, angle }: {
    location: LatLngExpression,
    angle?: number
}) => {
    const icon = divIcon({
        className: 'vehicle',
        html: renderToStaticMarkup(angle ? <ArrowUpward style={{ transform: `rotate(${angle - 90}deg)`, height: "20px", width: "20px" }} /> : <AccountCircle style={{ height: "20px", width: "20px" }} />),
        iconSize: [20, 20]
    });

    return <Marker position={location} icon={icon} zIndexOffset={1000} />
};