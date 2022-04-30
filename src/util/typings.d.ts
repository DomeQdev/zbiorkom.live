import { LatLngExpression } from "leaflet";

interface Vehicle {
    brigade?: string,
    deg: number | null,
    lastPing: number,
    line: string,
    location: LatLngExpression,
    tab: string,
    trip?: string,
    type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
    headsign?: string,
    delay?: number,
    isSpecial?: string,
    isPredicted?: boolean
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
    time: number,
    metersToStop: number,
    delay: number
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
            type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
            color: string,
            showFilter?: boolean
        }
    },
    special: [{
        name: string,
        tab: string,
        type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
        vehicle: Vehicle
    }]
}

interface VehicleInfo {
    tab: string,
    type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
    model: string,
    prodYear: string,
    carrier: string,
    depot?: string,
    registration?: string,
    doors?: number,
    seats?: number,
    length?: string,
    bikes?: number,
    features: string[],
    description?: string
}

type City = "warsaw" | "gdansk";
type MapStyle = "osm" | "mapbox" | "mapstr" | "mapsat" | "mapnav" | "gmaps" | "gsat";

export { Vehicle, Stop, Trip, FilterData, City, VehicleInfo, MapStyle };