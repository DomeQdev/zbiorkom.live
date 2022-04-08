import { useState } from "react";
import useWebSocket from 'react-use-websocket';
import VehicleMarker from "../components/VehicleMarker";
import { LatLngExpression } from 'leaflet';
import { useMap, useMapEvents } from "react-leaflet";

interface IVehicle {
	brigade: String,
	deg: Number | null,
	lastPing: Date,
	line: String,
	location: LatLngExpression,
	tab: String,
	trip?: String,
	type: "bus" | "tram" | "troley" | "skm" | "km" | "wkd" | "metro"
}

export default () => {
	const map = useMap();
	const [vehicles, setVehicles] = useState<IVehicle[]>([]);
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

	return <>
		<Events />
		{vehicles.map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={"warsaw"} />)}
	</>;

	function Events() {
		useMapEvents({
			moveend: () => setBounds(map.getBounds())
		});
		return null;
	}
};