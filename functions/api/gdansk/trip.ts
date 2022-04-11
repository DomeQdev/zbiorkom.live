import { point, nearestPointOnLine, lineString } from "@turf/turf";
import routes from "./util/routes.json";

export const onRequestGet = async ({ request }) => {
    let tripId = new URL(request.url).searchParams.get("trip");
    if (!tripId) return new Response(JSON.stringify({ error: "No params provided." }), { status: 400 });

    let [route, trip, start, service] = tripId.split("_");
    if (!route || !trip || !start || !service) return new Response(JSON.stringify({ error: "No params provided." }), { status: 400 });

    let date = `${new Date().getFullYear()}-${zeroPad(new Date().getMonth() + 1)}-${zeroPad(new Date().getDate())}`

    let shape: {
        coordinates: [[number, number]],
    } = await fetch(`https://ckan2.multimediagdansk.pl/shapes?date=${date}&routeId=${route}&tripId=${trip}`, {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!shape) return null;

    let stopTimes: {
        stopTimes: [
            {
                tripId: number,
                arrivalTime: string,
                departureTime: string,
                stopId: number,
                stopSequence: number,
                busServiceName: string,
                orde: number,
                onDemand: 1 | 0,
            }
        ]
    } = await fetch(`https://ckan2.multimediagdansk.pl/stopTimes?date=${date}&routeId=${route}`, {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!stopTimes) return null;

    let order = stopTimes.stopTimes.findIndex(stopTime => stopTime.tripId === Number(trip) && stopTime.stopSequence === 0 && stopTime.departureTime.split("T")[1] === start && stopTime.busServiceName === service);
    if (order === -1) return null;

    let stopTime = stopTimes.stopTimes.slice(order).filter((x, i) => x.stopSequence === i);
    if (!stopTime[0]) return null;

    let stops: {
        stops: [
            {
                stopId: number,
                stopCode: string,
                stopName: string,
                stopDesc: string,
                stopLat: number,
                stopLon: number
            }
        ]
    } = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);

    let line = lineString(shape.coordinates.map(x => [x[1], x[0]]));
    return {
        line: routes[route].line,
        headsign: null,
        color: routes[route].color,
        shape: shape.coordinates.map(x => [x[1], x[0]]),
        stops: stopTime.map(stop => {
            let stopData = stops?.stops?.find(s => s.stopId === stop.stopId);
            let nearest = nearestPointOnLine(line, point([stopData?.stopLat, stopData?.stopLon]), { units: 'meters' });
            return {
                name: `${stopData?.stopName} ${stopData?.stopCode}`,
                id: stop.stopId,
                on_request: stop.onDemand === 1,
                location: [stopData?.stopLat, stopData?.stopLon],
                arrival: czas(stop.arrivalTime.split("T")[1]),
                departure: czas(stop.departureTime.split("T")[1]),
                onLine: nearest.properties.location,
                index: nearest.properties.index
            }
        })
    };
};

function czas(time: string) {
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    return new Date().setHours(0, 0, 0, 0) + ((hours * 60 + minutes) * 60 * 1000);
}

function zeroPad(n: number) {
    return ('0' + n).slice(-2);
};