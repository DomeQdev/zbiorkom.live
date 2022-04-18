import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Vehicle } from "../util/typings";
import { Route, Routes } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import VehicleMarker from "../components/VehicleMarker";
import Error from "../pages/Error";
import Trip from "../pages/Trip";
import Filter from "../pages/Filter";

export default () => {
	const map = useMap();
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [bounds, setBounds] = useState(map.getBounds());

	useWebSocket("wss://ws.matfiu.repl.co/", {
		onOpen: () => console.log('opened'),
		onClose: () => console.log('closed'),
		onMessage: ({ data }) => setVehicles(JSON.parse(data)),
		shouldReconnect: () => true,
		reconnectInterval: 10000,
		reconnectAttempts: 15,
		retryOnError: true
	});

	useEffect(() => {
		fetch("/api/warsaw/positions").then(res => res.json()).then(setVehicles).catch(() => null);
	}, []);

	let filteredVehicles = vehicles;
	let inBounds = filteredVehicles.filter(vehicle => bounds.contains(vehicle?.location));

	map.on("moveend", () => setBounds(map.getBounds()));

	return <Routes>
		<Route path="/" element={inBounds.map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab || vehicle.trip}`} city={"warsaw"} />)} />
		<Route path="/filter" element={<Filter city={"warsaw"} />} />
		<Route path="/:type/:tab" element={<Trip vehicles={vehicles} city={"warsaw"} />} />
		<Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
	</Routes>;
};
