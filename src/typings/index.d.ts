import { LatLngExpression } from "leaflet";

interface Vehicle {
    brigade: string,
    deg: number | null,
    lastPing: number,
    line: string,
    location: LatLngExpression,
    tab: string,
    trip?: string,
    type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley"
}

interface Trip {
    id: string,
    line: string,
    headsign: string,
    color: string,
    shapes: LatLngExpression[],
    stops: [{
        name: string,
        id: string,
        on_request: boolean,
        location: LatLngExpression,
        arrival: Date,
        departure: Date,
        onLine: number,
        index: number
    }]
}

type City = "warsaw" | "gdansk";

export { Vehicle, City, Trip };