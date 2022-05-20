interface Vehicle {
    brigade?: string,
    deg: number | null,
    lastPing: number,
    line: string,
    location: [number, number],
    tab: string,
    trip?: string,
    type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
    headsign?: string,
    delay?: number,
    isEco?: boolean,
    isSpecial?: string,
    isPredicted?: boolean
}

interface Stop {
    name: string,
    id: string,
    on_request: boolean,
    location: [number, number],
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
    shapes: [number, number][],
    stops: Stop[],
    error?: string
}

interface FilterData {
    models: {
        [key: string]: string[]
    },
    routes: [[{
        line: string,
        name: string,
        type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
        color: string,
        showFilter?: boolean
    }]],
    depots: {
        [key: string]: string[]
    }
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

interface Departure {
    line: string,
    route: string,
    type: "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley",
    color: string,
    brigade: string,
    headsign: string,
    delay: number,
    status: "REALTIME" | "SCHEDULED",
    realTime: number,
    scheduledTime: number,
    vehicle?: Vehicle
}

type City = "warsaw" | "gdansk";
type MapStyle = "osm" | "mapbox" | "mapstr" | "mapsat" | "mapnav" | "gmaps" | "gsat";

export { Vehicle, Stop, Trip, FilterData, City, VehicleInfo, MapStyle, Departure };