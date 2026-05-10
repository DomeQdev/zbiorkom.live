import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Trip } from "typings";
import { getDaysSince2020 } from "@/util/tools";

type BrigadeQueryProps = {
    city: string;
    route?: string;
    brigade?: string;
    date?: string;
};

export const useQueryBrigade = ({ city, route, brigade, date }: BrigadeQueryProps) => {
    return useQuery({
        queryKey: ["brigade", city, route, brigade, date],
        queryFn: ({ signal }) => getFromAPI<Trip[]>(city, `brigades/${route}/${brigade}/${date}`, {}, signal),
        enabled: !!route && !!brigade,
        refetchOnMount: false,
    });
};

export const useQueryBrigadeList = ({ city, route, date }: BrigadeQueryProps) => {
    return useQuery({
        queryKey: ["brigade", city, route, date],
        queryFn: ({ signal }) => getFromAPI<string[]>(city, `brigades/${route}/${date}`, {}, signal),
        refetchOnMount: false,
    });
};

export const getBrigadeDays = (language: string) => {
    const includeYesterday = new Date().getHours() < 4 ? 1 : 0;

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index - includeYesterday);

        return {
            valueDate: getDaysSince2020(date.getTime()).toString(),
            displayDate: date.toLocaleDateString(language, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
            dayOfWeek: date.toLocaleDateString(language, {
                weekday: "long",
            }),
        };
    });
};
