import { Stops } from './util/typings';

export const onRequestGet = async () => {
    let stops: Stops = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json?", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 / 2,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!stops) return new Response("Error", { status: 500 });


    return new Response(JSON.stringify(Object.values(stops)[0].stops.map(stop => {
        return {
            id: String(stop.stopId),
            name: `${stop.stopName || stop.stopDesc}${stop.stopCode ? ` ${stop.stopCode}` : ""}`,
            location: [stop.stopLat, stop.stopLon]
        }
    })), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
}