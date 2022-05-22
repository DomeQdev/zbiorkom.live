import { Bikes } from "../util/typings";
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { DirectionsBike } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { Translate } from "../util/Translations";

export default ({ bike, link }: { bike: Bikes, link?: boolean }) => {
    return (
        <Marker
            position={bike.location}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker${link ? "_active" : ""}`} style={{ border: `3px solid #104a9e` }} title={bike.name} />),
                iconSize: [30, 30],
                iconAnchor: [8, 7],
                popupAnchor: link ? [-2, -5] : [0, -5]
            })}
            zIndexOffset={100}
        >
            <Popup autoPan={false}><span style={{ display: "inline-flex" }}><DirectionsBike style={{ width: 18, height: 18 }} />&nbsp;<b style={{ fontSize: 14 }}>{bike.name}</b></span>{link && <><br /><Link to={`./bike/${bike.id}`}><Translate name="bikes_on_station" /></Link></>}</Popup>
        </Marker>
    );
};