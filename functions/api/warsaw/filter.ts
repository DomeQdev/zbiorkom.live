export const onRequestGet = async ({ env }) => {
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
    } = await fetch(`${env.WARSAW_BACKEND}/filter`, {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!apiResp) return new Response(JSON.stringify({ error: "No data received" }), { status: 500 });

    return new Response(JSON.stringify(apiResp), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
};