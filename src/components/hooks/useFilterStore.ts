import { create } from "zustand";
import { ERoute, Route } from "typings";
import { LngLatLike } from "mapbox-gl";
import { SearchRoutesOrModelsResult } from "./useQuerySearchRoutesOrModels";

interface FilterState {
    search: string;
    routes: Route[];
    tempRoutes: Route[];
    models: string[];
    tempModels: string[];
    initialPosition?: [number, LngLatLike];
    setSearch: (search: string) => void;
    setRoutes: (routes: Route[]) => void;
    addRoute: (route: Route) => void;
    removeRoute: (route: Route) => void;
    setModels: (models: string[]) => void;
    addModel: (model: string) => void;
    removeModel: (model: string) => void;
    addMany: (searchResults: SearchRoutesOrModelsResult) => void;
    setInitialPosition: (position: [number, LngLatLike]) => void;
    useTemp: () => void;
    applyChanges: () => void;
    reset: () => void;
}

export default create<FilterState>()((set) => ({
    search: "",
    routes: [],
    tempRoutes: [],
    models: [],
    tempModels: [],
    setSearch: (search) => {
        set({ search });
    },
    setRoutes: (tempRoutes) => {
        set({ tempRoutes });
    },
    addRoute: (route) => {
        set((state) => ({ tempRoutes: [...state.tempRoutes, route] }));
    },
    removeRoute: (route) => {
        set((state) => ({ tempRoutes: state.tempRoutes.filter((r) => r[ERoute.id] !== route[ERoute.id]) }));
    },
    setModels: (tempModels) => {
        set({ tempModels });
    },
    addModel: (model) => {
        set((state) => ({ tempModels: [...state.tempModels, model] }));
    },
    removeModel: (model) => {
        set((state) => ({ tempModels: state.tempModels.filter((m) => m !== model) }));
    },
    addMany: (searchResults) => {
        set((state) => ({
            tempRoutes: [
                ...state.tempRoutes,
                ...searchResults.filter((r): r is Route => typeof r !== "string"),
            ],
            tempModels: [
                ...state.tempModels,
                ...searchResults.filter((r): r is string => typeof r === "string"),
            ],
        }));
    },
    setInitialPosition: (initialPosition) => {
        set({ initialPosition });
    },
    useTemp: () => {
        set((state) => ({ tempRoutes: state.routes, tempModels: state.models }));
    },
    applyChanges: () => {
        set((state) => ({
            routes: state.tempRoutes,
            models: state.tempModels,
            tempRoutes: [],
            tempModels: [],
            initialPosition: undefined,
        }));
    },
    reset: () => {
        set({
            search: "",
            routes: [],
            tempRoutes: [],
            models: [],
            tempModels: [],
            initialPosition: undefined,
        });
    },
}));
