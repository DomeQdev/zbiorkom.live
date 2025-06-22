import { useQuery } from "@tanstack/react-query";
import { getFromAPI } from "@/util/fetchFunctions";
import { ETrip, Trip } from "typings";

type NextTripData = {
    nextTrip?: {
        departureTime: number;
        firstStopName: string;
        isLoop: boolean;
    };
};

type NextTripQueryProps = {
    city: string;
    currentTrip: Trip;
    enabled?: boolean;
};

export const useQueryNextTrip = ({ city, currentTrip, enabled = true }: NextTripQueryProps) => {
    const route = currentTrip[ETrip.route];
    const tripId = currentTrip[ETrip.id];
    
    return useQuery({
        queryKey: ["nextTrip", city, route[0], tripId],
        queryFn: async ({ signal }) => {
            // This endpoint would need to be implemented on the backend
            // For now, we'll return mock data or handle the case where it doesn't exist
            try {
                return await getFromAPI<NextTripData>(
                    city,
                    "trips/getNextTrip",
                    {
                        route: route[0],
                        currentTrip: tripId,
                    },
                    signal
                );
            } catch (error) {
                // If the endpoint doesn't exist yet, return null
                // This allows the component to handle the absence gracefully
                return null;
            }
        },
        enabled: enabled && !!currentTrip,
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 15000, // Consider data stale after 15 seconds
    });
};