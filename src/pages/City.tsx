import { useEffect, useState, useMemo } from "react";
import { useMap } from "react-leaflet";
import { City, Stop, Vehicle, FilterData } from "../util/typings";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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

	let filteredVehicles = useMemo(() => {
		let filterData = JSON.parse(localStorage.getItem(`${city}.filter.data`) || "{}") as FilterData;
		if (!filterData) return vehicles;

		let lines = JSON.parse(localStorage.getItem(`${city}.filter.lines`) || "[]") as string[];
		let models = JSON.parse(localStorage.getItem(`${city}.filter.models`) || "[]") as string[];
		let depots = JSON.parse(localStorage.getItem(`${city}.filter.depots`) || "[]") as string[];

		let _models = models.map(x => filterData.models[x]).flat();
		let _depots = depots.map(x => filterData.depots[x]).flat();

		return vehicles
			.filter(x => lines.length ? lines.includes(x.line) : true)
			.filter(x => _models.length ? _models.includes(`${x.type}${x.tab}`) : true)
			.filter(x => _depots.length ? _depots.includes(`${x.type}${x.tab}`) : true);
	}, [vehicles, useLocation()]);


	let inBounds = filteredVehicles.filter(vehicle => bounds.contains(vehicle?.location));

	map.on("moveend", () => setBounds(map.getBounds()));

	return <Routes>
		<Route path="/" element={<>
			{map.getZoom() >= 15 || (filteredVehicles.length !== vehicles.length && inBounds.length <= 150) ? inBounds.filter(x => x.trip).map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />) : null}
			{map.getZoom() >= 16 ? stops?.filter(stop => bounds.contains(stop.location)).map(stop => <StopMarker stop={stop} key={stop.id} color="red" departures />) : null}
			{map.getZoom() >= 17 || (filteredVehicles.length !== vehicles.length && inBounds.length <= 150) ? inBounds.filter(x => !x.trip).map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />) : null}
		</>} />
		<Route path="/wlt" element={vehicles.filter(veh => veh.line === "100" || veh.line === "36" || veh.line === "T" || veh.line === "N" || veh.line === "M").map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />)} />
		<Route path="/filter/*" element={<Filter vehicles={vehicles} city={city} onClose={() => navigate(`/${city}`)} />} />
		{cities[city].functions.stopDepartures && <Route path="/stop/:id" element={<StopDepartures city={city} stops={stops} vehicles={vehicles} />} />}
		<Route path="/:type/:tab/*" element={<Trip vehicles={vehicles} city={city} />} />
		<Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
	</Routes>;
};