import routes from "./util/routes.json";

export const onRequestGet = async () => {
    let response: {
        vehicles: [
            {
                "generated": string,
                "routeShortName": string,
                "tripId": number,
                "headsign": string,
                "vehicleCode": string,
                "vehicleService": string,
                "vehicleId": number,
                "speed": number,
                "direction": number,
                "delay": number,
                "scheduledTripStartTime": string,
                "lat": number,
                "lon": number,
                "gpsQuality": number
            }
        ]
    } = await fetch("https://ckan2.multimediagdansk.pl/gpsPositions?v=2").then(res => res.json()).catch(() => null);
    if (!response) return new Response("[]");

    return new Response(JSON.stringify(response.vehicles.map(vehicle => ({
        brigade: vehicle.vehicleService.split("-")[1],
        deg: vehicle.direction,
        lastPing: new Date(vehicle.generated).getTime(),
        line: vehicle.routeShortName,
        location: [vehicle.lat, vehicle.lon],
        tab: vehicle.vehicleCode,
        trip: `${Object.values(routes).find(x => x.line === String(vehicle.routeShortName))?.id}_${vehicle.tripId}_${timeString(new Date(new Date(vehicle.scheduledTripStartTime).getTime() + 2 * 60 * 60 * 1000).getTime())}_${vehicle.vehicleService}`,
        headsign: vehicle.headsign,
        type: Object.values(routes)?.find(x => x.line === String(vehicle.routeShortName))?.type || "bus",
        delay: Math.round(vehicle.delay / 60) || 0
    }))));
};

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}:${date.getSeconds() < 10 ? "0" : ""}${date.getSeconds()}`;
}