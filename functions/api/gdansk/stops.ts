export function onRequestGet() {
    return fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).then((res: {
        [key: string]: {
            stops: [{
                stopCode?: string,
                stopDesc?: string,
                stopLat: number,
                stopLon: number,
                stopName?: string,
                stopId: number,
            }]
        }
    }) => {
        return Object.values(res)[0].stops.map(stop => {
            return {
                id: String(stop.stopId),
                name: `${stop.stopName || stop.stopDesc}${stop.stopCode ? ` ${stop.stopCode}` : ""}`,
                location: [stop.stopLat, stop.stopLon]
            }
        });
    }).then(res => new Response(JSON.stringify(res))).catch(() => null);
}