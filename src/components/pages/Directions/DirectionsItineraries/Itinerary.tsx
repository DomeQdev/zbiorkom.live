import RouteTag from "@/map/RouteTag";
import Icon from "@/ui/Icon";
import { Box, SvgIcon } from "@mui/material";
import React from "react";
import { ERoute, NonTransitLeg, PlannerItinerary, Route, TransitLeg, VehicleType } from "typings";

export default ({ itinerary }: { itinerary: PlannerItinerary }) => {
    return (
        <Box>
            {itinerary.map((leg) => {
                if (leg.mode === "TRANSIT") {
                    return <ItineraryTransitLeg leg={leg} />;
                }

                return <ItineraryNonTransitLeg leg={leg} />;
            })}
        </Box>
    );
};

const ItineraryTransitLeg = ({ leg }: { leg: TransitLeg }) => {
    const allRoutes = leg.itineraries
        .flatMap((itinerary) => itinerary.routes)
        .filter((route, index, self) => index === self.findIndex((r) => r[ERoute.id] === route[ERoute.id]));

    // Sort routes: by type, then by agency, then by name for stable order
    const sortedRoutes = [...allRoutes].sort((a, b) => {
        if (a[ERoute.type] !== b[ERoute.type]) {
            return a[ERoute.type] - b[ERoute.type];
        }
        if (a[ERoute.agency] !== b[ERoute.agency]) {
            return a[ERoute.agency].localeCompare(b[ERoute.agency]);
        }
        return a[ERoute.name].localeCompare(b[ERoute.name]);
    });

    if (!sortedRoutes.length) {
        return null;
    }

    const routesGroupedByType: Record<string, Route[]> = sortedRoutes.reduce((acc, route) => {
        const typeKey = route[ERoute.type].toString();
        if (!acc[typeKey]) {
            acc[typeKey] = [];
        }
        acc[typeKey].push(route);
        return acc;
    }, {} as Record<string, Route[]>);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
            {Object.entries(routesGroupedByType).map(([typeStr, routesInThisType]) => {
                const type = +typeStr as VehicleType;
                const firstRouteOfThisType = routesInThisType[0];

                // Group by agency within this type
                const routesGroupedByAgency: Record<string, Route[]> = routesInThisType.reduce(
                    (acc, route) => {
                        const agencyKey = route[ERoute.agency];
                        if (!acc[agencyKey]) {
                            acc[agencyKey] = [];
                        }
                        acc[agencyKey].push(route);
                        return acc;
                    },
                    {} as Record<string, Route[]>
                );

                return (
                    <Box
                        key={type}
                        component="span"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: firstRouteOfThisType[ERoute.color],
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.9em",
                        }}
                    >
                        <SvgIcon
                            sx={{
                                fontSize: "1.2em",
                                marginRight: "4px",
                            }}
                        >
                            <Icon type={type} agency={firstRouteOfThisType[ERoute.agency]} />
                        </SvgIcon>
                        {Object.entries(routesGroupedByAgency).map(
                            ([agency, routesInThisAgency], agencyIndex) => (
                                <React.Fragment key={agency}>
                                    {agencyIndex > 0 && (
                                        <Box component="span" sx={{ marginX: "4px" }}>
                                            |
                                        </Box>
                                    )}
                                    <b>{routesInThisAgency.map((r) => r[ERoute.name]).join(" / ")}</b>
                                </React.Fragment>
                            )
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

const ItineraryNonTransitLeg = ({ leg }: { leg: NonTransitLeg }) => {
    return (
        <Box>
            <div>Non-Transit Leg</div>
            <div>Mode: {leg.mode}</div>
        </Box>
    );
};
