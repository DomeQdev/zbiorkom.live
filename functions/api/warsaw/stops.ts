export const onRequestGet = async ({ env }) => {
    let stops = await fetch(`${env.WARSAW_BACKEND}/stops`, {
        //@ts-ignore
        cf: {
            cacheTtl: 86400 / 2,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!stops) return new Response("Error", { status: 500 });

    return new Response(JSON.stringify(stops), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
}