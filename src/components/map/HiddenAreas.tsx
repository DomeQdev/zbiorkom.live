import { memo, useEffect } from "react";
import { useMap } from "@vis.gl/react-maplibre";
import { LayerSpecification, SourceSpecification } from "maplibre-gl";
import { HIDDEN_AREA_LABEL, hiddenAreaLabels, hiddenAreaStripes, hiddenAreas } from "@/util/hiddenAreas";

// vehicle dots are the only map layer allowed to stay above the blank spot (DotMarkers)
const DOTS_LAYER_ID = "dots";

const SOURCES: Record<string, SourceSpecification> = {
    "hidden-areas": { type: "geojson", data: hiddenAreas },
    "hidden-areas-hatch": { type: "geojson", data: hiddenAreaStripes },
    "hidden-areas-stamp": { type: "geojson", data: hiddenAreaLabels },
};

// every 2nd/4th/8th stripe drops out as you zoom out, so the hatch keeps roughly the same
// spacing on screen from z11 (~20px apart) all the way in
const STRIPE_LEVEL = ["<=", ["get", "level"], ["step", ["zoom"], 0, 12, 1, 14, 2, 16, 3]] as any;

const LAYERS: LayerSpecification[] = [
    {
        id: "hidden-areas-fill",
        type: "fill",
        source: "hidden-areas",
        paint: { "fill-color": "#fff" },
    },
    {
        id: "hidden-areas-hatch",
        type: "line",
        source: "hidden-areas-hatch",
        minzoom: 11,
        filter: STRIPE_LEVEL,
        paint: {
            "line-color": "#dfe6f0",
            "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 14, 4, 18, 10],
        },
    },
    {
        id: "hidden-areas-outline",
        type: "line",
        source: "hidden-areas",
        paint: {
            "line-color": "#ccd6e4",
            "line-width": 1.5,
            "line-dasharray": [3, 2],
        },
    },
    {
        // the stamp is placed before the hatch labels, so it wins the collision at low zoom
        id: "hidden-areas-stamp",
        type: "symbol",
        source: "hidden-areas-stamp",
        minzoom: 10,
        maxzoom: 14,
        layout: {
            "text-field": HIDDEN_AREA_LABEL,
            "text-font": ["Noto Sans Bold"],
            "text-transform": "uppercase",
            "text-size": ["interpolate", ["linear"], ["zoom"], 10, 9, 13, 15],
            "text-letter-spacing": 0.16,
            "text-max-width": 9,
            "text-line-height": 1.4,
            "text-rotate": -45,
            "text-rotation-alignment": "map",
        },
        paint: {
            "text-color": "#7b8798",
            "text-halo-color": "#fff",
            "text-halo-width": 1.6,
        },
    },
    {
        id: "hidden-areas-hatch-labels",
        type: "symbol",
        source: "hidden-areas-hatch",
        minzoom: 12,
        filter: STRIPE_LEVEL,
        layout: {
            "text-field": HIDDEN_AREA_LABEL,
            "text-font": ["Noto Sans Bold"],
            "text-size": 11,
            "text-letter-spacing": 0.08,
            "text-padding": 6,
            "text-max-angle": 20,
            "symbol-placement": "line",
            "symbol-spacing": 260,
        },
        paint: {
            "text-color": "#8d99ab",
            "text-halo-color": "#fff",
            "text-halo-width": 1.4,
        },
    },
];

const LAYER_IDS = LAYERS.map(({ id }) => id);

export default memo(() => {
    const map = useMap()?.current;

    useEffect(() => {
        if (!map) return;

        const gl = map.getMap();

        const draw = () => {
            // isStyleLoaded() stays false while tiles are still coming in, so instead of
            // gating on it we just try: if the style itself is not ready to take layers yet,
            // the styledata it fires once it is will bring us straight back here
            try {
                for (const [id, source] of Object.entries(SOURCES)) {
                    if (!gl.getSource(id)) gl.addSource(id, source);
                }

                for (const layer of LAYERS) {
                    if (!gl.getLayer(layer.id)) gl.addLayer(layer);
                }

                // routes, stops and platforms are appended on top of the style as pages mount,
                // so the blank spot has to be lifted back up whenever the layer list changes
                const order = gl.getLayersOrder();
                const expected = order.includes(DOTS_LAYER_ID) ? [...LAYER_IDS, DOTS_LAYER_ID] : LAYER_IDS;

                if (order.slice(-expected.length).join() === expected.join()) return;

                for (const id of expected) gl.moveLayer(id);
            } catch {}
        };

        draw();
        gl.on("styledata", draw);
        gl.on("load", draw);

        return () => {
            gl.off("styledata", draw);
            gl.off("load", draw);

            for (const id of LAYER_IDS) {
                if (gl.getLayer(id)) gl.removeLayer(id);
            }

            for (const id of Object.keys(SOURCES)) {
                if (gl.getSource(id)) gl.removeSource(id);
            }
        };
    }, [map]);

    return null;
});
