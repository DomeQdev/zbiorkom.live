import { point, nearestPointOnLine, lineString } from "@turf/turf";

export const onRequestGet = async ({ request, env }) => {
    let line = new URL(request.url).searchParams.get("line");
    let brigade = new URL(request.url).searchParams.get("brigade");
    if (!line || !brigade) return new Response(JSON.stringify({ error: "No params provided." }), { status: 400 });

    let data: [{
        trip: string,
        headsign: string,
        start: number,
        end: number
    }] = await fetch(`${env.WARSAW_BACKEND}/brigade?line=${line}&brigade=${brigade}`).then(res => res.json()).catch(() => null);
    if (!data) return new Response(JSON.stringify({ error: "Brigade not found" }), { status: 404 });

    return new Response(JSON.stringify(data));
};