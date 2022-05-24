import { Parking } from "../util/typings";
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocalParking } from "@mui/icons-material";
import { Translate } from "../util/Translations";

export default ({ parking }: { parking: Parking }) => {
    return (
        <Marker
            position={parking.location}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker`} style={{ border: `3px solid #18349d` }} title={parking.name} />),
                iconSize: [30, 30],
                iconAnchor: [8, 7],
                popupAnchor: [1, -5]
            })}
            zIndexOffset={100}
        >
            <Popup autoPan={false}><span style={{ display: "inline-flex" }}><LocalParking style={{ width: 17, height: 17 }} />&nbsp;<b style={{ fontSize: 14 }}>{parking.name}</b></span><br /><Translate name="free_parking_spaces" replace={parking.availableSpots} /></Popup>
        </Marker>
    );
};