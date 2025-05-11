import { Location, Shape } from "typings";
import getSunPosition from "./getSunPosition";

function calculateAzimuthBetweenPoints(coord1: Location, coord2: Location) {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;
    const dLng = lng2 - lng1;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const azimuth = Math.atan2(y, x) * (180 / Math.PI);

    return (azimuth + 360) % 360;
}

export default (shape: Shape) => {
    const firstCoord = shape.geometry.coordinates[0];
    const sunAzimuthDegrees = getSunPosition(firstCoord[0], firstCoord[1]);

    const { coordinates } = shape.geometry;
    const totalSegments = coordinates.length - 1;

    const exposure = {
        left: 0,
        right: 0,
        front: 0,
        back: 0,
    };

    for (let i = 0; i < totalSegments; i++) {
        const start = coordinates[i];
        const end = coordinates[i + 1];
        const segmentAzimuth = calculateAzimuthBetweenPoints(start, end);

        const angleDifference = (segmentAzimuth - sunAzimuthDegrees + 360) % 360;

        if (angleDifference < 90) {
            exposure.right++;
        } else if (angleDifference < 180) {
            exposure.back++;
        } else if (angleDifference < 270) {
            exposure.left++;
        } else {
            exposure.front++;
        }
    }

    const exposurePercentages = {
        left: (exposure.left / totalSegments) * 100,
        right: (exposure.right / totalSegments) * 100,
        front: (exposure.front / totalSegments) * 100,
        back: (exposure.back / totalSegments) * 100,
    } as Record<string, number>;

    let bestSide = "left";
    let bestPercentage = exposurePercentages.left;

    for (const side in exposurePercentages) {
        if (exposurePercentages[side] < bestPercentage) {
            bestPercentage = exposurePercentages[side];
            bestSide = side;
        }
    }

    return {
        exposurePercentages,
        bestSide,
        bestSideType: bestSide === "left" || bestSide === "right" ? "side" : "direction",
    };
};
