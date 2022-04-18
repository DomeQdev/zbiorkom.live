import specialVehicles from './util/specialVehicles.json';

export const onRequestGet = async () => {
    let apiResp: {
        models: {
            [key: string]: [number]
        },
        routes: {
            [key: string]: {
                line: string,
                name: string,
                type: string,
                color: string
            }
        }
    } = await fetch("https://wtp-location-backend.matfiu.repl.co/filter", {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!apiResp) return new Response(JSON.stringify({ error: "No data received" }), { status: 500 });

    return new Response(JSON.stringify(Object.assign(apiResp, {
        special: specialVehicles
    })));
};