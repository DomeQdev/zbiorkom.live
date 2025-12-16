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

export const esriSatelliteStyle = rasterStyle(
    "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false",
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
        name: "Esri Satellite",
        style: esriSatelliteStyle,
        attribution: ['&copy; <a href="https://www.esri.com" target="_blank">Esri</a>'],
    },
} as Record<string, MapStyleDefinition>;
