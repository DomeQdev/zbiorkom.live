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
    time: number
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

interface FilterData {
    models: {
        [key: string]: Array
    },
    routes: {
        [key: string]: {
            line: string,
            name: string,
            type: string,
            color: string
        }
    },
    special: [{
        name: string,
        tab: string,
        type: "bus" | "tram",
        vehicle: Vehicle
    }]
}

type City = "warsaw" | "gdansk";

export { Vehicle, Stop, Trip, FilterData, City };