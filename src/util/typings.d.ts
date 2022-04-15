import { LatLngExpression } from "leaflet";

interface Vehicle {
    brigade?: string,
    deg: number | null,
    lastPing: number,
    line: string,
    location: LatLngExpression,
    tab: string,
    trip?: string,
    type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley"
}

interface Stop {
    name: string,
    id: string,
    on_request: boolean,
    location: LatLngExpression,
    arrival: number,
    departure: number,
    onLine: number,
    index: number,
    minute: number
}


interface Trip {
    id: string,
    line: string,
    headsign: string,
    color: string,
    shapes: LatLngExpression[],
    stops: Stop[],
    error?: string
}

type City = "warsaw" | "gdansk";

export { Vehicle, City, Trip, Stop };