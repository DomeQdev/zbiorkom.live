import { Location } from "typings";
import { polylineToGeoJson } from "./tools";

// Areas blanked out on purpose: the map is painted white inside them and hatched with
// "tajemnica przedsiębiorstwa" stripes, and every stop the API returns there is dropped
// before it reaches the map (vehicles still show up, they just drive across a blank spot).
// Rings are 1e6 polylines — the same encoding the API uses for shapes.
// Sulejówek — town boundary, OSM relation 336679 (admin_level 7).
const HIDDEN_AREA_SHAPES = [
    "eaxsbByjgog@tnA{MbViCz~AwPn|I}x@fBicD`I}`Bf@oRYkf@_Awh@mDqj@oC}]wN{hAoB{d@eCa`@uMqb@yKgYqm@}{A{GqSeK{`@aB}G_EoPoImc@gHyc@qDy_@uBo_@fwEfWvrA|aBzdApqAlv@p`AbfBxIjkKlh@vz@nFtHLtONEq_AX}dAF_QHqY@gCBic@Ba`@FyEd@md@jQ{rNpDsxCjIg_Ht@kl@vKywI~I_vHH@r@ca@BsMp@aa@Zw_@@mP~@gk@G?h@eYG?VuUFC^i[E?\\}WgOoRsGUaEe~@wvAnOcAyc@nvAcOgAe[?uHI{tAivDf[uA{t@sWfBk@}g@_R~@{F}yCic@bBsRkmDyIygCfmF}fKiVmrBwDsWic@o^kGnv@{z@fS_g@hOmmAb_@kBnx@_IphDgHxjCuyAdSoEay@{Aaa@WmB}BiXe@oJoJgeBgAyVo@sI_@{BcKqhBQsMsN}hC_OalCuOiyCcGcqA{Ckq@_Ekq@s@eJuEf@ef@bT_f@~Syo@x\\ktArl@am@nWu\\zNHlCqq@nY}XtKa[tMws@n[md@fS{gBnw@_OGdKgp@dO_`AbJ}i@xD}V}ByvAM}TaBscBsAsq@eAeWWcQy@}MsEi~AeEgyAoCwo@TG]u@}JcmBmHwtAyGwcA[s@gA~@i]dm@qz@`wAgo@pbAqDpJyy@vcE{EpFgYxQoZgQqCeDsdA|Cc`@fIeNmK}k@}hA}XgQsgAoc@k`BoiAfWt{F~c@hkKxAz_@usBjn@ybCrt@aJbYaVlb@qGtCm[qq@acC_eGwAC{bB~wE_zBhlG`JjW`fAz{Acu@viDbq@l_A~l@ro@jFzFj@j@`z@jo@dbB`aCxDw@|J|wAvCth@{hV{yAtXvmFrq@xtM||@h~Pr}AltYdeAraTxkQqyBjEkiCbEVfW`BrEXn`FfZlgE`YfB~kAnDnmD`DjcBhEtyBbFvfDnExlBdKjhF",
];

export const HIDDEN_AREA_LABEL = "tajemnica przedsiębiorstwa";

const METERS_PER_DEGREE = 111320;

// Distance between the densest stripes. Every 2nd, 4th and 8th stripe gets a lower "level",
// so the hatch can be thinned out by zoom and keeps a similar density on screen everywhere.
const STRIPE_SPACING = 125;
const MIN_STRIPE_LENGTH = 60;

type HiddenArea = {
    ring: Location[];
    bbox: [west: number, south: number, east: number, north: number];
};

const hiddenAreaList: HiddenArea[] = HIDDEN_AREA_SHAPES.map((shape) => {
    const ring = polylineToGeoJson(shape).geometry.coordinates as Location[];
    const bbox: HiddenArea["bbox"] = [Infinity, Infinity, -Infinity, -Infinity];

    for (const [lng, lat] of ring) {
        bbox[0] = Math.min(bbox[0], lng);
        bbox[1] = Math.min(bbox[1], lat);
        bbox[2] = Math.max(bbox[2], lng);
        bbox[3] = Math.max(bbox[3], lat);
    }

    return { ring, bbox };
});

export const hiddenAreas: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
    type: "FeatureCollection",
    features: hiddenAreaList.map(({ ring }) => ({
        type: "Feature",
        properties: {},
        geometry: {
            type: "Polygon",
            coordinates: [ring],
        },
    })),
};

// ray casting — only reached after the bbox check, so it stays cheap even for whole map streams
const isInRing = (ring: Location[], lng: number, lat: number) => {
    let inside = false;

    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [lngI, latI] = ring[i];
        const [lngJ, latJ] = ring[j];

        if (latI > lat !== latJ > lat && lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI) {
            inside = !inside;
        }
    }

    return inside;
};

export const isHidden = (location?: Location | null): boolean => {
    if (!location) return false;

    const [lng, lat] = location;

    return hiddenAreaList.some(
        ({ ring, bbox }) =>
            lng >= bbox[0] && lng <= bbox[2] && lat >= bbox[1] && lat <= bbox[3] && isInRing(ring, lng, lat),
    );
};

// Diagonal hatch, cut to the shape of every area: the stripes are the pattern and the
// labels ride along them (symbol-placement: line), so both come from the same geometry.
// Everything is computed in local meters, where a 45° line is also 45° on the screen.
const buildStripes = ({ ring, bbox }: HiddenArea): GeoJSON.Feature<GeoJSON.LineString>[] => {
    const scaleX = Math.cos((((bbox[1] + bbox[3]) / 2) * Math.PI) / 180) * METERS_PER_DEGREE;
    const diagonal = Math.SQRT1_2;

    // stripe direction is (1, 1), its normal (-1, 1) — both normalized
    const toX = ([lng]: Location) => lng * scaleX;
    const toY = ([, lat]: Location) => lat * METERS_PER_DEGREE;
    const toOffset = (point: Location) => (toY(point) - toX(point)) * diagonal;
    const toAlong = (point: Location) => (toX(point) + toY(point)) * diagonal;

    const offsets = ring.map(toOffset);
    const first = Math.ceil(Math.min(...offsets) / STRIPE_SPACING);
    const last = Math.floor(Math.max(...offsets) / STRIPE_SPACING);

    const stripes: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    for (let step = first; step <= last; step++) {
        const offset = step * STRIPE_SPACING;
        const crossings: number[] = [];

        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const from = offsets[j] - offset;
            const to = offsets[i] - offset;

            if (from <= 0 === to <= 0) continue;

            const ratio = from / (from - to);
            crossings.push(toAlong(ring[j]) + (toAlong(ring[i]) - toAlong(ring[j])) * ratio);
        }

        crossings.sort((a, b) => a - b);

        // the boundary is a simple ring, so crossings pair up into inside/outside runs
        for (let i = 0; i + 1 < crossings.length; i += 2) {
            if (crossings[i + 1] - crossings[i] < MIN_STRIPE_LENGTH) continue;

            const toLocation = (along: number): Location => [
                ((along - offset) * diagonal) / scaleX,
                ((along + offset) * diagonal) / METERS_PER_DEGREE,
            ];

            stripes.push({
                type: "Feature",
                properties: {
                    // 0 survives the lowest zooms, 3 only shows up when zoomed all the way in
                    level: step % 8 === 0 ? 0 : step % 4 === 0 ? 1 : step % 2 === 0 ? 2 : 3,
                },
                geometry: {
                    type: "LineString",
                    coordinates: [toLocation(crossings[i]), toLocation(crossings[i + 1])],
                },
            });
        }
    }

    return stripes;
};

export const hiddenAreaStripes: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
    type: "FeatureCollection",
    features: hiddenAreaList.flatMap(buildStripes),
};

// one stamp per area, dropped on the area centroid (bbox center as a fallback for shapes
// whose centroid falls outside, so the label never lands on the map next to the blank spot)
export const hiddenAreaLabels: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: hiddenAreaList.map(({ ring, bbox }) => {
        let area = 0;
        let lng = 0;
        let lat = 0;

        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const cross = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];

            area += cross;
            lng += (ring[j][0] + ring[i][0]) * cross;
            lat += (ring[j][1] + ring[i][1]) * cross;
        }

        const centroid: Location = area ? [lng / (3 * area), lat / (3 * area)] : [0, 0];
        const center: Location = isInRing(ring, centroid[0], centroid[1])
            ? centroid
            : [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

        return {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: center,
            },
        };
    }),
};
