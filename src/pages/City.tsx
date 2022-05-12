import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { City, Stop, Vehicle } from "../util/typings";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useWebSocket from "react-use-websocket";
import VehicleMarker from "../components/VehicleMarker";
import StopMarker from "../components/StopMarker";
import cities from "../util/cities.json";
import Error from "./Error";
import Trip from "./Trip";
import Filter from "./Filter";
import StopDepartures from "./StopDepartures";

export default ({ city }: {
	city: City
}) => {
	const map = useMap();
	const navigate = useNavigate();
	const [stops, setStops] = useState<Stop[]>([]);
	const [veh, setVehicles] = useState<Vehicle[]>([]);
	const [bounds, setBounds] = useState(map.getBounds());

	const { lastJsonMessage }: { lastJsonMessage: Vehicle[] } = useWebSocket(cities[city].api.positions_websocket, {
		onOpen: () => console.log('opened'),
		onClose: () => console.log('closed'),
		onReconnectStop: () => toast.error("Utracono połączenie z serwerem.", { autoClose: false }),
		shouldReconnect: () => true,
		reconnectInterval: 10000,
		reconnectAttempts: 10,
		retryOnError: true
	});

	const vehicles = lastJsonMessage || veh || [];

	useEffect(() => {
		fetch(cities[city].api.positions).then(res => res.json()).then(setVehicles).catch(() => null)
		if (cities[city].functions.stopDepartures) fetch(cities[city].api.stopList || "").then(res => res.json()).then(setStops).catch(() => null);
	}, []);

	let linesFilter = JSON.parse(localStorage.getItem(`${city}.filter.lines`) || "[]") as string[];

	let filteredVehicles = vehicles.filter(vehicle => linesFilter.length ? linesFilter.includes(vehicle.line) : true);
	let inBounds = filteredVehicles.filter(vehicle => bounds.contains(vehicle?.location));

	map.on("moveend", () => setBounds(map.getBounds()));

	return <Routes>
		<Route path="/" element={<>
			{(map.getZoom() >= 15 || (linesFilter.length && inBounds.length <= 150)) ? inBounds.filter(x => x.trip).map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />) : null}
			{map.getZoom() >= 16 ? stops?.filter(stop => bounds.contains(stop.location)).map(stop => <StopMarker stop={stop} key={stop.id} color="red" departures />) : null}
			{map.getZoom() >= 17 || (linesFilter.length && inBounds.length <= 150) ? inBounds.filter(x => !x.trip).map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />) : null}
		</>} />
		<Route path="/wlt" element={vehicles.filter(veh => veh.line === "100" || veh.line === "36" || veh.line === "T").map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />)} />
		<Route path="/filter/*" element={<Filter vehicles={vehicles} city={city} onClose={() => navigate(`/${city}`)} />} />
		{cities[city].functions.stopDepartures && <Route path="/stop/:id" element={<StopDepartures city={city} stops={stops} vehicles={vehicles} />} />}
		<Route path="/:type/:tab/*" element={<Trip vehicles={vehicles} city={city} />} />
		<Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
	</Routes>;
};