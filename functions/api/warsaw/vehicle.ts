export const onRequestGet = async ({ request, env }) => {
    let url = new URL(request.url);
    let tab = url.searchParams.get('tab');
    let type = url.searchParams.get('type');
    if (!tab || !type) return new Response("No params", { status: 400 });

    let data: {
        model: string,
        prodYear: string,
        type: "bus" | "tram",
        registration: string,
        tab: string,
        carrier: string,
        depot: string,
        features: string[],
    } = await fetch(`${env.WARSAW_BACKEND}/vehicle?vehicle=${type}${tab}`, {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if(!data) return new Response("Vehicle not found", { status: 404 });

    return new Response(JSON.stringify({
        tab: data.tab,
        type: data.type,
        photo: null,
        model: data.model,
        prodYear: data.prodYear,
        carrier: data.carrier,
        depot: data.depot,
        registration: data.registration,
        doors: null,
        seats: null,
        length: null,
        bikes: null,
        patron: null,
        features: data.features
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=2592000"
        }
    });
};