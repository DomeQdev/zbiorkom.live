import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { BrigadeTrip } from "typings";

type BrigadeQueryProps = {
    city: string;
    route: string;
    brigade: string;
};

export const useQueryBrigade = ({ city, route, brigade }: BrigadeQueryProps) => {
    return useQuery({
        queryKey: ["brigade", city, route, brigade],
        queryFn: async ({ signal }) =>
            getFromAPI<BrigadeTrip[]>(city, "brigades/getBrigade", { route, brigade }, signal),
        refetchOnMount: true,
    });
};

export const useQueryBrigadeList = ({ city, route }: { city: string; route: string }) => {
    return useQuery({
        queryKey: ["brigade", city, route],
        queryFn: async ({ signal }) =>
            getFromAPI<BrigadeTrip[]>(city, "brigades/getBrigadeList", { route }, signal),
        refetchOnMount: true,
    });
};
