export const onRequestGet = async () => {
    let data: {
        positions: [
            {
                id: string,
                timestamp: string,
                lat: number,
                lon: number,
                side_number: string,
                trip_id: string,
                bearing: number
            }
        ]
    } = await fetch("https://mkuran.pl/gtfs/warsaw/vehicles.json").then(res => res.json()).catch(() => null);
    if (!data || !data.positions) return new Response("[]");

    let trains: [{
        line: string,
        trip: string,
        headsign: string,
        location: [number, number],
        deg: number
    }] = await fetch("https://wtp-location-backend.matfiu.repl.co/predict").then(res => res.json()).then(t => t.map(x => ({
        ...x,
        tab: x.trip.replace(/\//g, "."),
        type: x.line.includes("S") ? "skm" : (x.line.includes("R") ? "km" : (x.line.includes("M") ? "metro" : (x.line.includes("A") ? "wkd" : null)))
    }))).catch(() => []);

    return new Response(JSON.stringify(data.positions.map(x => {
        let trip = x.trip_id.split("/");
        trip.shift();
        return {
            line: x.id.split("/")[1],
            type: x.id.split("/")[1].length === 3 ? "bus" : "tram",
            location: [x.lat, x.lon],
            deg: Math.floor(x.bearing + 360),
            brigade: x.id.split("/")[2],
            tab: x.side_number,
            lastPing: new Date(x.timestamp).getTime(),
            trip: trip.join("/")
        }
    //@ts-ignore
    }).concat(trains)));
};