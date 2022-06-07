import routes from "./util/routes.json";

export const onRequestGet = async () => {
    let lines = Object.values(routes).filter(x => x.showFilter);
    return new Response(JSON.stringify({
        routes: [
            lines.filter(x => x.type === "tram"),
            lines.filter(x => x.type === "bus" && !x.line.startsWith("N")),
            lines.filter(x => x.type === "bus" && x.line.startsWith("N"))
        ]
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
}