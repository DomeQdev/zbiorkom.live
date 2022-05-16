export const onRequestGet = async ({ env, request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) return new Response("No params", { status: 400 });

    let res = await fetch(`${env.WARSAW_BACKEND}/stop?id=${id}`).then(res => res.json()).catch(() => []);
    return new Response(JSON.stringify(res));
};