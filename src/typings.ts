export type VehicleType = 0 | 1 | 2 | 3 | 4 | 11 | 20;
export type DelayType = number | "departure" | "departed" | "cancelled" | "live" | "scheduled";
export type Location = [number, number];
export type SheetContentTypes =
    | "Cities"
    | "Vehicle"
    | "Stop"
    | "Station"
    | "Filter"
    | "FavoriteStops"
    | "Trip"
    | "Route"
    | null;

export interface City {
    id: string;
    name: string;
    location: Location;
    zoom?: number;
    description?: string;
    showNewTag?: boolean;
    disableBrigades?: boolean;
    disableVehicleInfo?: boolean;
}

export type Route = [
    id: string,
    city: string,
    name: string,
    agency: string,
    type: VehicleType,
    color: string,
    longName?: string
];

export enum ERoute {
    id = 0,
    city = 1,
    name = 2,
    agency = 3,
    type = 4,
    color = 5,
    longName = 6,
}

export type Vehicle = [
    id: string,
    city: string,
    route: Route,
    brigade: string,
    location: Location,
    bearing: number,
    lastPing: number,
    trip: string,
    percentTraveled: number
];

export enum EVehicle {
    id = 0,
    city = 1,
    route = 2,
    brigade = 3,
    location = 4,
    bearing = 5,
    lastPing = 6,
    trip = 7,
    percentTraveled = 8,
}

export type DotVehicle = [routeColor: string, location: Location];

export enum EDotVehicle {
    routeColor = 0,
    location = 1,
}

export type Stop = [
    id: string,
    city: string,
    name: string,
    location: Location,
    type: VehicleType,
    station: boolean,
    bearing: number,
    routes: Route[],
    direction?: string
];

export enum EStop {
    id = 0,
    city = 1,
    name = 2,
    location = 3,
    type = 4,
    station = 5,
    bearing = 6,
    routes = 7,
    direction = 8,
}

export type MapData = {
    bbox: [number, number, number, number];
    stops?: Stop[];
    geoJson?: {
        source: GeoJSON.GeoJSON;
        layers: any[];
    }[];
} & ({ useDots: false; positions: Vehicle[] } | { useDots: true; positions: DotVehicle[] });

export type APIVehicle = {
    sequence?: number;
    vehicle?: Vehicle;
    trip?: Trip;
    stops?: StopUpdate[];
};

export type Trip = [
    id: string,
    city: string,
    headsign: string,
    route: Route,
    shortName: string,
    description: string,
    stops: TripStop[],
    shape: Shape,
    platforms: Platforms
];

export enum ETrip {
    id = 0,
    city = 1,
    headsign = 2,
    route = 3,
    shortName = 4,
    description = 5,
    stops = 6,
    shape = 7,
    platforms = 8,
}

export type TripStop = [
    id: string,
    name: string,
    location: Location,
    sequence: number,
    arrival: number,
    departure: number,
    type: ETripStopType
];

export enum ETripStop {
    id = 0,
    name = 1,
    location = 2,
    sequence = 3,
    arrival = 4,
    departure = 5,
    type = 6,
}

export enum ETripStopType {
    notBoardable = 0,
    normal = 1,
    onDemand = 2,
}

export type Shape = {
    type: "Feature";
    geometry: {
        type: "LineString";
        coordinates: Location[];
    };
    properties: {};
};

export type Platform = {
    type: "Feature";
    geometry: {
        type: "Polygon";
        coordinates: [Location[]];
    };
    properties: {
        name: string;
    };
};

export type Platforms = {
    type: "FeatureCollection";
    features: Platform[];
};

export type StopDepartures = [stop: Stop, departures: StopDeparture[], hasMore: boolean];

export enum EStopDepartures {
    stop = 0,
    departures = 1,
    hasMore = 2,
}

export type StopDeparture = [
    id: string,
    headsign: string,
    route: Route,
    shortName: string,
    brgiade: string,
    vehicleId: string,
    vehicle: Vehicle | null,
    departure: StopTime,
    destination: StopTime | null,
    platform?: string,
    track?: string,
    alert?: { type: any; text: string }
];

export enum EStopDeparture {
    id = 0,
    headsign = 1,
    route = 2,
    shortName = 3,
    brigade = 4,
    vehicleId = 5,
    vehicle = 6,
    departure = 7,
    destination = 8,
    platform = 9,
    track = 10,
    alert = 11,
}

export type StopTime = [scheduled: number, estimated: number, delay: DelayType];

export enum EStopTime {
    scheduled = 0,
    estimated = 1,
    delay = 2,
}

export type StopUpdate = [
    arrival: StopTime,
    departure: StopTime,
    platform: string,
    track: string,
    alerts: string[]
];

export enum EStopUpdate {
    arrival = 0,
    departure = 1,
    platform = 2,
    track = 3,
    alerts = 4,
}

export type Brigade = [
    brigade: string,
    numberOfTrips: string,
    runningHours: string,
    combined: string[],
    vehicleId: string
];

export enum EBrigade {
    brigade = 0,
    numberOfTrips = 1,
    runningHours = 2,
    combined = 3,
    vehicleId = 4,
}

export type BrigadeTrip = [
    id: string,
    route: Route,
    startStop: string,
    endStop: string,
    start: number,
    end: number,
    distance: number,
    vehicle?: string,
    percentTraveled?: number
];

export enum EBrigadeTrip {
    id = 0,
    route = 1,
    startStop = 2,
    endStop = 3,
    start = 4,
    end = 5,
    distance = 6,
    vehicle = 7,
    percentTraveled = 8,
}

export type RouteInfo = [route: Route, directions: RouteDirection[]];

export enum ERouteInfo {
    route = 0,
    directions = 1,
}

export type RouteDirection = [direction: 0 | 1, headsign: string, stops: TripStop[], shape: Shape];

export enum ERouteDirection {
    direction = 0,
    headsign = 1,
    stops = 2,
    shape = 3,
}

export type VehicleInfo = [
    id: string,
    model: string,
    prodYear: string,
    depot: string,
    carrier: string,
    imageHash: string
];

export enum EVehicleInfo {
    id = 0,
    model = 1,
    prodYear = 2,
    depot = 3,
    carrier = 4,
    imageHash = 5,
}

export type APISearch = {
    groupNames: string[];
    groups: number[];
    results: SearchItem[];
};

export type SearchItem = {
    borderTop?: boolean;
    borderBottom?: boolean;

    stop?: string;
    station?: string;
    route?: Route;
    relation?: [id: string, route: Route, shortName: string, start: number, end: number, headsign: string];
    vehicle?: [id: string, route: Route, brigade: string, headsign?: string, model?: string];
};

export enum ESearchRelation {
    id = 0,
    route = 1,
    shortName = 2,
    start = 3,
    end = 4,
    headsign = 5,
}

export enum ESearchVehicle {
    id = 0,
    route = 1,
    brigade = 2,
    headsign = 3,
    model = 4,
}

export type StopDirection = [
    id: string,
    name: string,
    code: string | null,
    direction: string | null,
    routes: string | null
];

export enum EStopDirection {
    id = 0,
    name = 1,
    code = 2,
    direction = 3,
    routes = 4,
}

export interface BlogPost {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    content: string;
}

export interface FavoriteStop {
    id: string;
    location: Location;
    directions: [string, string][];
    isStation?: boolean;
}

export type ExecutionDates = string[];

export type ExecutionVehicles = [
    date: string,
    route: string,
    brigade: string | null,
    vehicles: ExecutionVehicle[]
];

export enum EExecutionVehicles {
    date = 0,
    route = 1,
    brigade = 2,
    vehicles = 3,
}

export type ExecutionVehicle = [vehicleId: string, trips: number];

export enum EExecutionVehicle {
    vehicleId = 0,
    trips = 1,
}

export type Execution = [
    gtfsTripId: string,
    vehicleId: string,
    route: string,
    brigade: string | null,
    scheduledStartTime: number,
    startDelay: number,
    scheduledEndTime: number,
    endDelay: number | null,
    startStopName: string,
    endStopName: string
];

export enum EExecution {
    gtfsTripId = 0,
    vehicleId = 1,
    route = 2,
    brigade = 3,
    scheduledStartTime = 4,
    startDelay = 5,
    scheduledEndTime = 6,
    endDelay = 7,
    startStopName = 8,
    endStopName = 9,
}

export type SearchPlace = [type: "google" | "station", id: string, name: string, address: string];

export enum ESearchPlace {
    type = 0,
    id = 1,
    name = 2,
    address = 3,
}

export type NonTransitLeg = {
    mode: "WALK" | "BIKE" | "RENTAL";
    distance: number; // (meters)
    duration: number; // (milliseconds)
    shape: string;
    rental?: [fromStationName: string, toStationName: string];
};

export type TransitLeg = {
    mode: "TRANSIT";
    routes: Route[];
};

export type PlannerItinerary = {
    legs: (TransitLeg | NonTransitLeg)[];
};

declare global {
    interface Window {
        historyLength: number;
        skipPadding: boolean;
    }

    interface Gay {
        base: string;
        cloudBase: string;
        ws: string;
    }

    var Gay: Gay;
}
