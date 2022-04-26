import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { City, Vehicle } from "../util/typings";
import { Route, Routes, useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import VehicleMarker from "../components/VehicleMarker";
import Error from "../pages/Error";
import Trip from "../pages/Trip";
import Filter from "../pages/Filter";
import cities from "../util/cities.json";

export default ({ city }: {
    city: City
}) => {
	const map = useMap();
	const navigate = useNavigate();
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [bounds, setBounds] = useState(map.getBounds());

	useWebSocket(cities[city].api.positions_websocket, {
		onOpen: () => console.log('opened'),
		onClose: () => console.log('closed'),
		onMessage: ({ data }) => setVehicles(JSON.parse(data)),
		shouldReconnect: () => true,
		reconnectInterval: 10000,
		reconnectAttempts: 15,
		retryOnError: true
	});

	useEffect(() => {
		fetch(cities[city].api.positions).then(res => res.json()).then(setVehicles).catch(() => null);
	}, []);

	let linesFilter = JSON.parse(localStorage.getItem(`${city}.filter.lines`) || "[]") as string[];

	let filteredVehicles = vehicles.filter(vehicle => linesFilter.length ? linesFilter.includes(vehicle.line) : true);
	let inBounds = filteredVehicles.filter(vehicle => bounds.contains(vehicle?.location));

	map.on("moveend", () => setBounds(map.getBounds()));

	return <Routes>
		<Route path="/" element={inBounds.length <= 125 && inBounds.map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />)} />
		<Route path="/filter/*" element={<Filter vehicles={vehicles} city={city} onClose={() => navigate(`/${city}`)} />} />
		<Route path="/:type/:tab" element={<Trip vehicles={vehicles} city={city} />} />
		<Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
	</Routes>;
};