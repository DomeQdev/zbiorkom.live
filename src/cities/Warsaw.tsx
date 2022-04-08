import { useState } from "react";
import useWebSocket from 'react-use-websocket';
import { useMap, useMapEvents } from "react-leaflet";

export default () => {
    const map = useMap();
    const [vehicles, setVehicles] = useState([]);
    const [bounds, setBounds] = useState(map.getBounds());

    useWebSocket("wss://ws.domeqalt.repl.co/", {
        onOpen: () => console.log('opened'),
        onClose: () => console.log('closed'),
        onMessage: ({ data }) => setVehicles(JSON.parse(data)),
        shouldReconnect: () => true,
        reconnectInterval: 10000,
        reconnectAttempts: 15,
        retryOnError: true
    });

    {console.log(vehicles)}

    return <>
        <Events />
    </>;

    function Events() {
        useMapEvents({
            moveend: () => setBounds(map.getBounds())
        });
        return null;
    }
};