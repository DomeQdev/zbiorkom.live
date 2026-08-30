export enum VehicleType {
    Tram = 0,
    Subway = 1,
    Train = 2,
    Bus = 3,
    Ferry = 4,
    AerialLift = 6,
    Funicular = 7,
    Trolleybus = 11,
    Monorail = 12,
}
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
    | "MapStyle"
    | null;

export interface CityAgency {
    id: string;
    name: string;
    icon?: string;
    faresUrl?: string;
    dataSources?: { text: string; url: string }[];
}

export interface City {
    id: string;
    name: string;
    location: Location;
    timezone: string;
    zoom?: number;
    description?: string;
    showNewTag?: boolean;
    disableBrigades?: boolean;
    virtual?: boolean;
    agencies?: Record<string, CityAgency>;
}

export type Route = [
    id: string,
    city: string,
    name: string,
    longName: string,
    agency: string,
    type: VehicleType,
    color: string,
];

export enum ERoute {
    id = 0,
    city = 1,
    name = 2,
    longName = 3,
    agency = 4,
    type = 5,
    color = 6,
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
    percentTraveled: number,
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
    code: string,
    location: Location,
    types: VehicleType[],
    bearing: number,
    direction: string,
    routes: Route[],
];

export enum EStop {
    id = 0,
    city = 1,
    name = 2,
    code = 3,
    location = 4,
    types = 5,
    bearing = 6,
    direction = 7,
    routes = 8,
}

export type StopExit = [name: string, location: Location];

export enum EStopExit {
    name = 0,
    location = 1,
}

export type MapData = {
    suggestedCity?: string;
    bbox: [number, number, number, number];
    stops?: Stop[];
    geoJson?: {
        source: GeoJSON.GeoJSON;
        layers: any[];
    }[];
} & ({ useDots: false; positions: Vehicle[] } | { useDots: true; positions: DotVehicle[] });

export type ItineraryStop = [stop: Stop, alight: number, distance: number, platform?: string];

export enum EItineraryStop {
    stop = 0,
    alight = 1,
    distance = 2,
    platform = 3,
}

export type Itinerary = [stops: ItineraryStop[], shape: string];

export enum EItinerary {
    stops = 0,
    shape = 1,
}

export type APIVehicle = {
    sequence?: number;
    vehicle?: Vehicle;
    trip?: Trip;
    stops?: StopUpdate[];
    lastPing?: number;
};

export type Trip = [
    id: string,
    city: string,
    route: Route,
    headsign: string,
    brigade: string,
    shortName: string,
    description: [key: string, value: string][],
    firstStop?: [stopName: string, arrival: number],
    lastStop?: [stopName: string, departure: number],
    distance?: number,
];

export enum ETrip {
    id = 0,
    city = 1,
    route = 2,
    headsign = 3,
    brigade = 4,
    shortName = 5,
    description = 6,
    firstStop = 7,
    lastStop = 8,
    distance = 9,
}

export type TripStop = [id: string, name: string, location: Location, type: ETripStopType];

export enum ETripStop {
    id = 0,
    name = 1,
    location = 2,
    type = 3,
}

export enum ETripStopType {
    notBoardable = 0,
    normal = 1,
    onDemand = 2,
}

export type Shape = GeoJSON.Feature<GeoJSON.LineString>;
export type Platform = GeoJSON.Feature<GeoJSON.Polygon, { name: string }>;
export type Platforms = GeoJSON.FeatureCollection<GeoJSON.Polygon, { name: string }>;

export type StopDepartures = [stop: Stop, departures: StopDeparture[], hasMore: boolean];

export enum EStopDepartures {
    stop = 0,
    departures = 1,
    hasMore = 2,
}

export type StopDeparture = [
    trip: Trip,
    vehicle: Vehicle | null,
    departure: StopTime,
    destination?: StopTime,
];

export enum EStopDeparture {
    trip = 0,
    vehicle = 1,
    departure = 2,
    destination = 3,
}

export type StopTime = [scheduled: number, delay: number, status: EStopDepartureStatus, platform?: string];

export enum EStopTime {
    scheduled = 0,
    delay = 1,
    status = 2,
    platform = 3,
}

export type StopUpdate = [
    arrival: StopTime,
    departure: StopTime,
    platform: string,
    track: string,
    alerts: string[],
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
    vehicleId: string,
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
    percentTraveled?: number,
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

export type RouteGraphStop = [
    id: string,
    city: string,
    name: string,
    code: string,
    location: Location,
    types: VehicleType[],
    bearing?: number,
];

export type RouteGraphBranch = {
    from: number; // trunk position the variant leaves after, -1 = starts off the trunk
    to: number; // trunk position the variant rejoins at, -1 = ends off the trunk
    stops: RouteGraphStop[];
};

export type RouteGraphDirection = { headsign: string; trunk: RouteGraphStop[]; branches: RouteGraphBranch[] };

export type RouteGraphRawResponse = {
    route: Route;
    graph: RouteGraphDirection[];
    shapes: string[][]; // per direction: [0] the trunk, then one polyline per branch
};

export type RouteGraph = {
    route: Route;
    graph: RouteGraphDirection[];
    shapes: Shape[][];
};

export type VehicleInfo = [id: string, model: string, prodYear: number, carrier: string, imageHash: string];

export enum EVehicleInfo {
    id = 0,
    model = 1,
    prodYear = 2,
    carrier = 3,
    imageHash = 4,
}

export type VehicleSearchTuple = [
    id: string,
    route: Route,
    brigade: string,
    headsign: string | undefined,
    model: string | undefined,
];

export type StopSearchTuple = [id: string, city: string, name: string, group: Stop[]];

export type SearchItem = {
    vehicle?: VehicleSearchTuple;
    stop?: StopSearchTuple;
    station?: StopSearchTuple;
    route?: Route;
    borderTop?: boolean;
    borderBottom?: boolean;
};

export type SearchGroupName = "vehicles" | "stops" | "stations" | "routes";

export type SearchResponse = {
    results: SearchItem[];
    groups: number[];
    groupNames: SearchGroupName[];
};

export type SearchRawResponse = {
    positions: VehicleSearchTuple[];
    stops: StopSearchTuple[];
    stations: StopSearchTuple[];
    routes: Route[];
};

export type SearchErrorResponse = { error: "MISSING_QUERY" | "CITY_NOT_FOUND" };

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
    routes: string | null,
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

// "Co wyjechało?" — retrospective view of dispatches that actually ran, reconstructed
// from observed segments (v6 API `dispatches/*`). Times are epoch ms (UTC), delays are
// in SECONDS (positive = late, negative = early). Route badges reuse the shared `Route`
// tuple (called RouteTuple in the API docs). Data has a 30-day retention window.

export type ExecutionAutocomplete = {
    routes: Route[]; // present in ClickHouse for the city, pre-sorted
    vehicles: string[]; // unique vehicle numbers, numeric sort
};

export type ExecutionDates = string[]; // ["2026-07-21", ...] local Warsaw days, descending

export type Execution = [
    trip: string,
    route: string, // routeId — matches Route[ERoute.id] from autocomplete
    brigade: string,
    vehicle: string,
    originStopId: string,
    originName: string,
    destStopId: string,
    destName: string,
    scheduledStart: number,
    actualStart: number,
    startDelay: number, // seconds
    scheduledEnd: number,
    actualEnd: number,
    endDelay: number, // seconds
    segments: number, // observed segments — completeness indicator
];

export enum EExecution {
    trip = 0,
    route = 1,
    brigade = 2,
    vehicle = 3,
    originStopId = 4,
    originName = 5,
    destStopId = 6,
    destName = 7,
    scheduledStart = 8,
    actualStart = 9,
    startDelay = 10,
    scheduledEnd = 11,
    actualEnd = 12,
    endDelay = 13,
    segments = 14,
}

export type ExecutionStop = [
    stopId: string,
    stopName: string,
    scheduledArrival: number,
    actualArrival: number,
    delay: number, // seconds
];

export enum EExecutionStop {
    stopId = 0,
    stopName = 1,
    scheduledArrival = 2,
    actualArrival = 3,
    delay = 4,
}

export type ExecutionTrip = { stops: ExecutionStop[] };

export type SearchPlace = [type: "google" | "stop", id: string, name: string, address?: string];

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
    rental?: {
        fromStation: string;
        toStation: string;
    };
    shape: Shape;
};

export type TransitLeg = {
    mode: "TRANSIT";
    fromStop: Stop;
    toStop: Stop;
    departures: StopDeparture[];
    token: string;
    routes: Route[];
    intermediateStops: Stop[];
    shape: Shape;
};

export type SelectedTrip = {
    tripId: string;
    scheduled: number;
    legIndex: number;
};

export type PlannerItinerary = {
    legs: (TransitLeg | NonTransitLeg)[];
    itineraryIndex: number;
    departureTime: number;
    arrivalTime: number;
    duration: number;
    isLive: boolean;
    selectedTrips: SelectedTrip[];
};

export type PlannerResult = {
    fromLocation: Location;
    toLocation: Location;
    itineraries: PlannerItinerary[];
};

declare global {
    interface Window {
        historyLength: number;
        skipPadding: boolean;
    }

    interface Gay {
        base: string;
        cloudBase: string;
    }

    var Gay: Gay;
}

export enum EStopDepartureStatus {
    Scheduled,
    OnTrip,
    OnPreviousTrip,
    Cancelled,
}
