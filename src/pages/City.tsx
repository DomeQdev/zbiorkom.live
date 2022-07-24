import { useEffect, useState, useMemo } from "react";
import { useMap } from "react-leaflet";
import { City, Stop, Vehicle, FilterData, Bikes, Parking } from "../util/typings";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useWebSocket from "react-use-websocket";
import { io } from "socket.io-client";
import VehicleMarker from "../components/VehicleMarker";
import BikeMarker from "../components/BikeMarker";
import StopMarker from "../components/StopMarker";
import cities from "../util/cities.json";
import Error from "./Error";
import Trip from "./Trip";
import Filter from "./Filter";
import StopDepartures from "./StopDepartures";
import BikeStation from "./BikeStation";
import ParkingMarker from "../components/ParkingMarker";

export default ({ city }: {
	city: City
}) => {
	const map = useMap();
	const navigate = useNavigate();
	const [stops, setStops] = useState<Stop[]>([]);
	const [bikes, setBikes] = useState<Bikes[]>([]);
	const [parkings, setParkings] = useState<Parking[]>([]);
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [bounds, setBounds] = useState(map.getBounds());

	if(city === "warsaw" || city === "poznan") {
		useEffect(() => {
			io("https://api.zbiorkom.live/", {
				query: {
					city: city
				}
			}).on("positions", (data: Vehicle[]) => setVehicles(data));
		}, [])
	} else {
		useWebSocket(cities[city].api.positions_websocket, {
			onOpen: () => console.log('opened'),
			onClose: () => console.log('closed'),
			onReconnectStop: () => toast.error("Utracono połączenie z serwerem.", { autoClose: false }),
			onMessage: ({ data }) => setVehicles(JSON.parse(data)),
			shouldReconnect: () => true,
			reconnectInterval: 10000,
			reconnectAttempts: 10,
			retryOnError: true
		});
	}

	useEffect(() => {
		fetch(cities[city].api.positions).then(res => res.json()).then(setVehicles).catch(() => null)
		if (cities[city].functions.stopDepartures) fetch(cities[city].api.stopList || "").then(res => res.json()).then(setStops).catch(() => null);
		if (cities[city].functions.bikes) fetch(cities[city].api.bikes || "").then(res => res.json()).then(setBikes).catch(() => null);
		if (cities[city].functions.parkings) fetch(cities[city].api.parkings || "").then(res => res.json()).then(setParkings).catch(() => null);
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
			{map.getZoom() >= 14 ? parkings?.filter(parking => bounds.contains(parking.location)).map(parking => <ParkingMarker parking={parking} key={parking.id} />) : null}
			{map.getZoom() >= 15 || (filteredVehicles.length !== vehicles.length && inBounds.length <= 150) ? inBounds.filter(x => x.trip).map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />) : null}
			{map.getZoom() >= 16 ? stops?.filter(stop => bounds.contains(stop.location)).map(stop => <StopMarker stop={stop} key={stop.id} color="red" link />) : null}
			{map.getZoom() >= 16 ? bikes?.filter(bike => bounds.contains(bike.location)).map(bike => <BikeMarker bike={bike} key={bike.id} link />) : null}
			{map.getZoom() >= 17 || (filteredVehicles.length !== vehicles.length && inBounds.length <= 150) ? inBounds.filter(x => !x.trip).map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />) : null}
		</>} />
		<Route path="/wlt" element={vehicles.filter(veh => veh.line === "100" || veh.line === "36" || veh.line === "T" || veh.line === "N" || veh.line === "M").map(vehicle => <VehicleMarker vehicle={vehicle} key={`${vehicle.type}${vehicle.tab}`} city={city} />)} />
		<Route path="/filter/*" element={<Filter vehicles={vehicles} city={city} onClose={() => navigate(`/${city}`)} />} />
		{cities[city].functions.stopDepartures && <Route path="/stop/:id" element={<StopDepartures city={city} stops={stops} vehicles={vehicles} />} />}
		{cities[city].functions.bikes && <Route path="/bike/:id" element={<BikeStation city={city} bikes={bikes} />} />}
		<Route path="/:type/:tab/*" element={<Trip vehicles={vehicles} city={city} />} />
		<Route path="*" element={<Error type="error" message="Nie znaleziono strony." />} />
	</Routes>;
};