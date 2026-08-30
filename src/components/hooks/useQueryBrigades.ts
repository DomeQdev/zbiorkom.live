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

export const getBrigadeDays = (language: string, timezone: string) => {
    // Anchor the day list to the city's timezone, not the device's, so the picker
    // matches the backend's service days regardless of device settings.
    const localHour = +new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "numeric",
        hourCycle: "h23",
    })
        .formatToParts(Date.now())
        .find((part) => part.type === "hour")!.value;

    const includeYesterday = localHour < 4 ? 1 : 0;
    const todayIndex = getDaysSince2020(Date.now(), timezone);

    return Array.from({ length: 7 }, (_, index) => {
        const dayIndex = todayIndex + index - includeYesterday;
        // Noon UTC of that calendar day stays inside the day in every city timezone,
        // so formatting it back in that timezone yields the same date.
        const timestamp = (dayIndex + 18262) * 86400000 + 43200000;

        return {
            valueDate: dayIndex.toString(),
            displayDate: new Intl.DateTimeFormat(language, {
                timeZone: timezone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(timestamp),
            dayOfWeek: new Intl.DateTimeFormat(language, {
                timeZone: timezone,
                weekday: "long",
            }).format(timestamp),
        };
    });
};
