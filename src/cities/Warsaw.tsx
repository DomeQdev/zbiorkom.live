import { useState } from "react";
import { useMap } from "react-leaflet";
import { Vehicle } from "../typings";
import { Route, Routes } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import VehicleMarker from "../components/VehicleMarker";
import Error from "../pages/Error";

export default () => {
	const map = useMap();
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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

	let filteredVehicles = vehicles;
	let inBounds = filteredVehicles.filter(vehicle => bounds?.contains(vehicle?.location));

	map.on("moveend", () => setBounds(map.getBounds()));

	return <>
	<Routes>
		<Route path="/" element={inBounds.map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={"warsaw"} />)} />

		<Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
	</Routes>
	</>;
};