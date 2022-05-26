import routes from './util/routes.json';
import { Stops } from './util/typings';

export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) return new Response("No params", { status: 400 });

    let response: {
        departures: [{
            delayInSeconds: number
            estimatedTime: string
            headsign: string
            id: string
            routeId: number
            scheduledTripStartTime: string
            status: "REALTIME" | "SCHEDULED"
            theoreticalTime: string
            timestamp: string
            trip: number
            tripId: number
            vehicleCode: number
            vehicleId: number
            vehicleService: string
        }]
    } = await fetch(`https://ckan2.multimediagdansk.pl/departures?stopId=${id}`).then(res => res.json()).catch(() => null);
    if (!response) return new Response("Error", { status: 500 });

    return new Response(JSON.stringify(response.departures.map(departure => ({
        line: routes[String(departure.routeId)].line,
        route: String(departure.routeId),
        type: routes[String(departure.routeId)].type,
        color: routes[String(departure.routeId)].color,
        brigade: departure.vehicleService.split("-")[1],
        headsign: departure.headsign,
        delay: departure.delayInSeconds || 0,
        status: departure.status,
        realTime: new Date(departure.estimatedTime).getTime(),
        scheduledTime: new Date(departure.theoreticalTime).getTime(),
        trip: `${departure.routeId}_${departure.tripId}_${timeString(new Date(new Date(departure.scheduledTripStartTime).getTime() + 2 * 60 * 60 * 1000).getTime())}_${departure.vehicleService}`,
    }))));
};

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}:${date.getSeconds() < 10 ? "0" : ""}${date.getSeconds()}`;
}