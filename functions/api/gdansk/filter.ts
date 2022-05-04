import routes from "./util/routes.json";

export const onRequestGet = async () => {
    return new Response(JSON.stringify({
        models: {},
        routes
    }));
}