import { createBrowserRouter, Outlet, redirect, RouterProvider } from "react-router-dom";
import CityRedirect from "./CityRedirect";
import { lazy, Suspense } from "react";

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

const Directions = lazy(() => import("@/pages/Directions"));

const Settings = lazy(() => import("@/pages/Settings/"));
const SettingsTheme = lazy(() => import("@/pages/Settings/ThemeDialog"));

const Stop = lazy(() => import("@/pages/Stop"));
const StopTimePicker = lazy(() => import("@/sheet/Stop/StopTimePicker"));

const Trip = lazy(() => import("@/pages/Trip"));
const TripAlerts = lazy(() => import("@/pages/Trip/TripAlerts"));
const VehicleInfo = lazy(() => import("@/pages/Trip/VehicleInfo"));

const Cities = lazy(() => import("@/pages/Cities"));
const City = lazy(() => import("@/pages/City"));
const Error = lazy(() => import("@/pages/Error"));
const Executions = lazy(() => import("@/pages/Executions"));
const FavoriteStops = lazy(() => import("@/pages/FavoriteStops"));
const Filter = lazy(() => import("@/pages/Filter"));
const Route = lazy(() => import("@/pages/Route"));
const Routes = lazy(() => import("@/pages/Routes"));
const Search = lazy(() => import("@/pages/Search/"));

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
            errorElement: <Error />,
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
                                    path: "directions",
                                    element: (
                                        <Suspense>
                                            <Directions />
                                        </Suspense>
                                    ),
                                },
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
                                    <Trip />
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
                            path: "station/:stop",
                            element: (
                                <Suspense>
                                    <Stop />
                                </Suspense>
                            ),
                            children: [
                                {
                                    path: "time",
                                    element: (
                                        <Suspense>
                                            <StopTimePicker />
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
                                    path: "time",
                                    element: (
                                        <Suspense>
                                            <StopTimePicker />
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
