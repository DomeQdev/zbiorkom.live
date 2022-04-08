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

type City = "warsaw" | "gdansk";

export { Vehicle, City };