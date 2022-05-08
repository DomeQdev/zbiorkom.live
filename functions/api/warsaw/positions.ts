export const onRequestGet = async ({ env }) => {
    let res = await fetch(`${env.WARSAW_BACKEND}/location`).then(res => res.json()).catch(() => []);
    return new Response(JSON.stringify(res));
};