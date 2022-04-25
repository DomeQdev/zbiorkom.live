import routes from "./util/routes.json";

export const onRequestGet = async () => {
    return new Response(JSON.stringify({
        models: {},
        routes,
        special: [
            {
                "name": "DomeQ jechał tym tramwajem",
                "tab": "1034",
                "type": "tram"
            }
        ]
    }));
}