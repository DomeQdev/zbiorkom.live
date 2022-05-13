import routes from "./util/routes.json";

export const onRequestGet = async () => {
    return new Response(JSON.stringify({
        routes
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
}