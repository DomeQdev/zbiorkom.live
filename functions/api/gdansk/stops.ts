export async function onRequestPost() {
    let stops = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!stops) return new Response("Error", { status: 500 });
    
    return stops.stops.map((stop: {
        stopCode?: string,
        stopDesc?: string,
        stopLat: number,
        stopLon: number,
        stopName?: string,
        stopShortName: string,
    }) => {
        return {
            id: stop.stopShortName,
            name: `${stop.stopName || stop.stopDesc} ${stop.stopCode}`,
            location: [stop.stopLat, stop.stopLon]
        }
    })
}