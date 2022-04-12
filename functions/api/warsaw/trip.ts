import { point, nearestPointOnLine, lineString } from "@turf/turf";

export const onRequestGet = async ({ request }) => {
    let tripId = new URL(request.url).searchParams.get("trip");
    if (!tripId) return new Response(JSON.stringify({ error: "No params provided." }), { status: 400 });

    let data: {
        color: string,
        headsign: string,
        line: string,
        shapes: [[number, number]],
        stops: [
            {
                name: string,
                id: string,
                on_request: boolean,
                location: [number, number],
                arrival: number,
                departure: number
            }
        ]
    } = await fetch(`https://wtp-location-backend.matfiu.repl.co/trip?trip=${tripId}`).then(res => res.json()).catch(() => null);
    if (!data) return new Response(JSON.stringify({ error: "Trip not found" }), { status: 404 });

    let line = lineString(data.shapes);
    return new Response(JSON.stringify({
        color: data.color,
        headsign: data.headsign,
        line: data.line,
        shapes: data.shapes,
        stops: data.stops.map(stop => {
            let nearest = nearestPointOnLine(line, point(stop.location), { units: 'meters' });
            return {
                ...stop,
                onLine: nearest.properties.location,
                index: nearest.properties.index
            }
        })
    }));
};