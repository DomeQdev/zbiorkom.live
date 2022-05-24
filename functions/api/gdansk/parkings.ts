export const onRequestGet = async () => {
    let parkingList: {
        id: string,
        name: string,
        location: {
            latitude: number,
            longitude: number
        }
    }[] = await fetch("https://ckan.multimediagdansk.pl/dataset/cb1e2708-aec1-4b21-9c8c-db2626ae31a6/resource/d361dff3-202b-402d-92a5-445d8ba6fd7f/download/parking-lots.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 2,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).then(x => x.parkingLots).catch(() => null);
    if (!parkingList) return new Response("[]", { status: 500 });

    let parkingLots: {
        parkingId: string,
        availableSpots: number
    }[] = await fetch("https://ckan2.multimediagdansk.pl/parkingLots").then(res => res.json()).then(x => x.parkingLots).catch(() => null);
    if (!parkingLots) return new Response("[]", { status: 500 });

    return new Response(JSON.stringify(parkingLots.map(parking => {
        let info = parkingList.find(x => x.id === parking.parkingId);
        return {
            id: parking.parkingId,
            name: info?.name,
            location: [info?.location.latitude, info?.location.longitude],
            availableSpots: parking.availableSpots
        }
    })));
};