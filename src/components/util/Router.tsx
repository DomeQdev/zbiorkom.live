import { createBrowserRouter, Outlet, redirect, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import CityRedirect from "./CityRedirect";
import { Socket } from "socket.io-client";

import LocationMarker from "@/map/LocationMarker";
import Sheet from "@/sheet/Sheet";
import Root from "@/pages/Root";
import Map from "@/map/Map";

const AddToFav = lazy(() => import("@/pages/AddToFav"));

const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/Blog/BlogPost"));
const BlogPosts = lazy(() => import("@/pages/Blog/BlogPosts"));

const Brigades = lazy(() => import("@/pages/Brigades"));
const Brigade = lazy(() => import("@/pages/Brigades/Brigade"));
const BrigadesSelect = lazy(() => import("@/pages/Brigades/Select"));
const BrigadeFromVehicle = lazy(() => import("@/pages/Brigades/BrigadeFromVehicle"));

const Settings = lazy(() => import("@/pages/Settings/"));
const SettingsTheme = lazy(() => import("@/pages/Settings/ThemeDialog"));

const Trip = lazy(() => import("@/pages/Trip"));
const TripAlerts = lazy(() => import("@/pages/Trip/TripAlerts"));

const Station = lazy(() => import("@/pages/Station"));
const StationTime = lazy(() => import("@/sheet/Station/StationTime"));

const Vehicle = lazy(() => import("@/pages/Vehicle"));
const VehicleInfo = lazy(() => import("@/pages/Vehicle/Info"));
const VehicleSun = lazy(() => import("@/pages/Vehicle/Sun"));

const Cities = lazy(() => import("@/pages/Cities"));
const City = lazy(() => import("@/pages/City"));
const Copyright = lazy(() => import("@/pages/Copyright"));
const Error = lazy(() => import("@/pages/Error"));
const Executions = lazy(() => import("@/pages/Executions"));
const FavoriteStops = lazy(() => import("@/pages/FavoriteStops"));
const Filter = lazy(() => import("@/pages/Filter"));
const Route = lazy(() => import("@/pages/Route"));
const Routes = lazy(() => import("@/pages/Routes"));
const Search = lazy(() => import("@/pages/Search/"));
const Stop = lazy(() => import("@/pages/Stop"));
const Veturilo = lazy(() => import("@/pages/Veturilo"));

export default () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Map>
                    <Sheet />
                    <LocationMarker />
                    <Outlet />
                </Map>
            ),
            children: [
                {
                    path: "",
                    element: <CityRedirect />,
                },
                {
                    path: "/cities",
                    element: (
                        <Suspense>
                            <Cities />
                        </Suspense>
                    ),
                },
                {
                    path: "/:city/",
                    element: <Root />,
                    children: [
                        {
                            path: "",
                            element: (
                                <Suspense>
                                    <City />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "search",
                                    element: (
                                        <Suspense>
                                            <Search />
                                        </Suspense>
                                    ),
                                },
                                {
                                    path: "favoriteStops",
                                    element: (
                                        <Suspense>
                                            <FavoriteStops />
                                        </Suspense>
                                    ),
                                },
                                {
                                    path: "executions",
                                    element: (
                                        <Suspense>
                                            <Executions />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "filter",
                            element: (
                                <Suspense>
                                    <Filter />
                                </Suspense>
                            ),
                        },
                        {
                            path: "vehicle/:vehicle",
                            element: (
                                <Suspense>
                                    <Vehicle />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "info",
                                    element: (
                                        <Suspense>
                                            <VehicleInfo />
                                        </Suspense>
                                    ),
                                },
                                {
                                    path: "sun",
                                    element: (
                                        <Suspense>
                                            <VehicleSun />
                                        </Suspense>
                                    ),
                                },
                                {
                                    path: "brigade",
                                    element: (
                                        <Suspense>
                                            <BrigadeFromVehicle />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "station/:station",
                            element: (
                                <Suspense>
                                    <Station />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "time",
                                    element: (
                                        <Suspense>
                                            <StationTime />
                                        </Suspense>
                                    ),
                                },
                                {
                                    path: "addToFav",
                                    element: (
                                        <Suspense>
                                            <AddToFav />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "stop/:stop",
                            element: (
                                <Suspense>
                                    <Stop />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "addToFav",
                                    element: (
                                        <Suspense>
                                            <AddToFav />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "trip/:trip",
                            element: (
                                <Suspense>
                                    <Trip />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "alerts",
                                    element: (
                                        <Suspense>
                                            <TripAlerts />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "route/:route",
                            element: (
                                <Suspense>
                                    <Route />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "brigades",
                                    element: (
                                        <Suspense>
                                            <Brigades />
                                        </Suspense>
                                    ),
                                    children: [
                                        {
                                            path: "",
                                            element: (
                                                <Suspense>
                                                    <BrigadesSelect />
                                                </Suspense>
                                            ),
                                        },
                                        {
                                            path: ":brigade",
                                            element: (
                                                <Suspense>
                                                    <Brigade />
                                                </Suspense>
                                            ),
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            path: "routes",
                            element: (
                                <Suspense>
                                    <Routes />
                                </Suspense>
                            ),
                        },
                        {
                            path: "brigades",
                            loader: ({ params }) => redirect(`/${params.city}/routes`),
                            children: [
                                {
                                    path: ":brigade",
                                    loader: ({ params }) => {
                                        const splitted = params.brigade?.split(".");

                                        if (!splitted || splitted.length !== 2) {
                                            return redirect(`/${params.city}/routes`);
                                        } else {
                                            return redirect(
                                                `/${params.city}/route/${splitted[0]}/brigades/${splitted[1]}`
                                            );
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            path: "stops",
                            loader: ({ params }) => redirect(`/${params.city}/search`),
                            children: [
                                {
                                    path: "*",
                                    loader: ({ params }) => redirect(`/${params.city}/search`),
                                },
                            ],
                        },
                        {
                            path: "blog",
                            element: (
                                <Suspense>
                                    <Blog />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "",
                                    element: (
                                        <Suspense>
                                            <BlogPosts />
                                        </Suspense>
                                    ),
                                },
                                {
                                    path: ":id",
                                    element: (
                                        <Suspense>
                                            <BlogPost />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "settings",
                            element: (
                                <Suspense>
                                    <Settings />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "theme",
                                    element: (
                                        <Suspense>
                                            <SettingsTheme />
                                        </Suspense>
                                    ),
                                },
                            ],
                        },
                        {
                            path: "copyright",
                            element: (
                                <Suspense>
                                    <Copyright />
                                </Suspense>
                            ),
                        },
                        {
                            path: "veturilo",
                            element: (
                                <Suspense>
                                    <Veturilo />
                                </Suspense>
                            ),
                        },
                    ],
                },
            ],
        },
        {
            path: "*",
            element: (
                <Suspense>
                    <Error />
                </Suspense>
            ),
        },
    ]);

    return <RouterProvider router={router} />;
};
