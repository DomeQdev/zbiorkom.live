import routes from "./util/routes.json";

export const onRequestGet = async () => {
    return new Response(JSON.stringify({
        models: {},
        routes
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
}