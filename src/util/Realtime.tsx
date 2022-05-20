import { nearestPointOnLine, point, lineString } from "@turf/turf";
import { Stop } from "./typings";

type Options = {
    stops: Stop[],
    shapes: [number,number][],
    location?: [number,number],
    moveStopsToLine?: boolean
}

type Result =  {
    stops: Stop[],
    delay?: number,
    lastStop: Stop,
    serving?: Stop,
    nextStop: Stop
}

const TripInfo = ({
    stops,
    shapes,
    location,
    moveStopsToLine,
}: Options): Result => {
    let line = lineString(shapes);

    let vehicleDistance = location ? nearestPointOnLine(line, point(location), { units: 'meters' }).properties.location || 0 : 0;
    let tripStart = minutesUntil(stops[0].departure) > 0 ? minutesUntil(stops[0].departure) : 0;

    let stopList = stops.map(stop => {
        let departure = stop.departure;
        let arrival = stop.arrival || departure;

        let nearest = (() => {
            if (stop.onLine) {
                return {
                    distance: stop.onLine,
                    location: stop.location
                };
            } else {
                let nearestPoint = nearestPointOnLine(line, point(stop.location), { units: 'meters' });
                return {
                    distance: nearestPoint.properties.location,
                    location: moveStopsToLine && nearestPoint.properties.dist! < 30 ? nearestPoint.geometry.coordinates : stop.location
                };
            }
        })();

        return {
            ...stop,
            metersToStop: nearest.distance! - vehicleDistance,
            location: nearest.location as [number, number],
            time: (arrival - stops[0].departure) / 1000 / 60,
        };
    });

    let lastStop = stopList.filter(stop => stop?.metersToStop < -50).pop() || stopList[0];
    let serving = stopList.find(stop => stop?.metersToStop < 50 && stop?.metersToStop > -50);
    let nextStop = stopList.find(stop => stop?.metersToStop > 50) || stopList[stopList.length - 1];

    let realTime = (nextStop?.time! - (serving?.time || lastStop?.time)) * percentTravelled(serving || lastStop, nextStop!);
    let delay = tripStart + Math.floor(realTime - minutesUntil(nextStop?.arrival));

    return {
        stops: stopList,
        delay,
        lastStop,
        serving,
        nextStop
    };
};

export type { Result, Options };
export { TripInfo };

function percentTravelled(stop1: Stop, stop2: Stop) {
    let res = stop1.metersToStop / (stop1.metersToStop - stop2.metersToStop);
    return (res >= 1 || res === -Infinity) ? 0 : (1 - res);
}

function minutesUntil(timestamp: number) {
    return Math.round((timestamp - Date.now()) / 60000);
}