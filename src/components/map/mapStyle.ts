import { StyleSpecification } from "maplibre-gl";

export const basicStyle = "/style.json";

const rasterStyle = (tiles: string): StyleSpecification => ({
    version: 8,
    name: "Raster Layer",
    sources: {
        raster: {
            type: "raster",
            tiles: [tiles],
            tileSize: 256,
        },
    },
    sprite: "https://tiles.openfreemap.org/sprites/ofm_f384/ofm",
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    layers: [
        {
            id: "raster-layer",
            type: "raster",
            source: "raster",
            paint: {
                "raster-brightness-max": 0.85,
                "raster-brightness-min": 0.15,
                "raster-contrast": 0.2,
                "raster-saturation": -0.2,
            },
        },
    ],
});

export const openStreetMapStyle = rasterStyle("https://tile.openstreetmap.org/{z}/{x}/{y}.png");

export const mapboxSatelliteStyle = rasterStyle(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemJpb3Jrb21saXZlIiwiYSI6ImNtZnNwbTVpZDA3YmEya3F2MTJkaW90eDAifQ.erqF5nTfk6StoSOU6wEsoQ",
);
export interface MapStyleDefinition {
    name: string;
    style: string | StyleSpecification;
    attribution: string[];
    supportsDark?: boolean;
}

export const mapStyles = {
    basic: {
        name: "Basic",
        style: basicStyle,
        attribution: [
            '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a>',
            '&copy; <a href="https://www.openmaptiles.org/" target="_blank">OpenMapTiles</a>',
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        ],
        supportsDark: true,
    },
    openStreetMap: {
        name: "OpenStreetMap",
        style: openStreetMapStyle,
        attribution: [
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        ],
        supportsDark: true,
    },
    googleSatellite: {
        name: "Mapbox Satellite",
        style: mapboxSatelliteStyle,
        attribution: ['&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>'],
    },
} as Record<string, MapStyleDefinition>;
