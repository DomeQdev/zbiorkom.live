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
    realTime: number,
    distance: number,
    time: number,
    metersToStop: number,
    delay: number,
    platform?: string
}


interface Trip {
    id: string,
    line: string,
    headsign: string,
    color: string,
    shapes: [number, number][],
    stops: Stop[],
    alerts: Alert[],
    error?: string
}

interface Alert {
    title: string,
    link: string
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
    vehicle?: Vehicle,
    trip?: string,
    platform?: string
}

interface Bikes {
    bike_racks: number,
    bikes: {
        number: number,
        name: string
    }[],
    free_racks: number,
    id: string,
    location: [number, number],
    name: string
}

interface Parking {
    id: string,
    name: string,
    location: [number, number],
    availableSpots: number,
}

type City = "warsaw" | "gdansk" | "poznan";
type MapStyle = "osm" | "mapbox" | "mapstr" | "mapsat" | "mapnav" | "gmaps" | "gsat";

export { Vehicle, Stop, Trip, Alert, FilterData, City, VehicleInfo, MapStyle, Departure, Bikes, Parking };