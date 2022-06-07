import { point, nearestPointOnLine, lineString } from "@turf/turf";
import routes from "./util/routes.json";

export const onRequestGet = async ({ request }) => {
    try {
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
            cacheTtl: 86400 / 2,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!shape) return new Response(JSON.stringify({ error: "Shapes error" }), { status: 400 });

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
            cacheTtl: 86400 / 2,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!stopTimes) return new Response(JSON.stringify({ error: "stopptimes error" }), { status: 400 });

    let order = stopTimes.stopTimes.findIndex(stopTime => stopTime.tripId === Number(trip) && stopTime.stopSequence === 0 && stopTime.departureTime.split("T")[1] === start && stopTime.busServiceName === service);
    if (order === -1) return new Response(JSON.stringify({ error: "no order" }), { status: 400 });

    let stopTime = stopTimes.stopTimes.slice(order).filter((x, i) => x.stopSequence === i);

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
    } = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json?", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 / 2,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);

    let line = lineString(shape.coordinates.map(x => [x[1], x[0]]));
    return new Response(JSON.stringify({
        id: tripId,
        line: routes[route].line,
        headsign: null,
        color: routes[route].color,
        shapes: shape.coordinates.map(x => [x[1], x[0]]),
        alerts: [],
        stops: stopTime.map(stop => {
            let stopData = stops?.stops?.find(s => s.stopId === stop.stopId);
            if(!stopData) return {
                name: "Brak danych",
                id: stop.stopId,
                on_request: stop.onDemand === 1,
                location: [0, 0],
                arrival: czas(stop.arrivalTime.split("T")[1]) - 2 * 60 * 60 * 1000,
                departure: czas(stop.departureTime.split("T")[1]) - 2 * 60 * 60 * 1000,
                distance: 0,
                time: (czas(stop.departureTime.split("T")[1]) - czas(stopTime[0].departureTime.split("T")[1])) / 1000 / 60
            };

            let nearest = nearestPointOnLine(line, point([stopData?.stopLat, stopData?.stopLon]), { units: 'meters' });
            
            return {
                name: `${stopData?.stopName} ${stopData?.stopCode}`,
                id: stop.stopId,
                on_request: stop.onDemand === 1,
                location: nearest.properties.dist! < 30 ? nearest.geometry.coordinates : [stopData?.stopLat, stopData?.stopLon],
                arrival: czas(stop.arrivalTime.split("T")[1]) - 2 * 60 * 60 * 1000,
                departure: czas(stop.departureTime.split("T")[1]) - 2 * 60 * 60 * 1000,
                distance: nearest.properties.location,
                time: (czas(stop.departureTime.split("T")[1]) - czas(stopTime[0].departureTime.split("T")[1])) / 1000 / 60
            }
        })
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
} catch (e) {
    console.log(e)
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
}
};

function czas(time: string) {
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    return new Date().setHours(0, 0, 0, 0) + ((hours * 60 + minutes) * 60 * 1000);
}

function zeroPad(n: number) {
    return ('0' + n).slice(-2);
};