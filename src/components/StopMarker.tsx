import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Stop } from "../util/typings";
import { Link } from 'react-router-dom';
import { Translate } from "../util/Translations";

export default ({ stop, color, departures = false}: { stop: Stop, color?: string, departures?: boolean }) => {
    return (
        <Marker
            position={stop.location}
            eventHandlers={{
                click: () => { }
            }}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker${departures ? "_active" : ""}`} style={{ border: `3px solid ${color}` }} title={stop.name} />),
                iconSize: [30, 30],
                iconAnchor: [8, 7],
                popupAnchor: departures ? [-1, -5] : [1, -5]
            })}
            zIndexOffset={100}
      >
            <Popup autoPan={false}><b>{stop.name}</b>{departures && <><br /><Link to={`stop/${stop.id}`}><Translate name="stop_departures" /></Link></>}</Popup>
        </Marker>
    );
};