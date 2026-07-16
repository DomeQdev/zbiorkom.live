import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { Trip } from "typings";
import { getDaysSince2020, AGENCY_TIMEZONE } from "@/util/tools";

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
    // Anchor the day list to the agency timezone (Warsaw), not the device's, so
    // the picker matches the backend's service days regardless of device settings.
    const warsawHour = +new Intl.DateTimeFormat("en-US", {
        timeZone: AGENCY_TIMEZONE,
        hour: "numeric",
        hourCycle: "h23",
    })
        .formatToParts(Date.now())
        .find((part) => part.type === "hour")!.value;

    const includeYesterday = warsawHour < 4 ? 1 : 0;
    const todayIndex = getDaysSince2020(Date.now());

    return Array.from({ length: 7 }, (_, index) => {
        const dayIndex = todayIndex + index - includeYesterday;
        // UTC midnight of that Warsaw calendar day resolves to 01:00/02:00 local,
        // safely inside the day, so formatting in the agency timezone yields it back.
        const timestamp = (dayIndex + 18262) * 86400000;

        return {
            valueDate: dayIndex.toString(),
            displayDate: new Intl.DateTimeFormat(language, {
                timeZone: AGENCY_TIMEZONE,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(timestamp),
            dayOfWeek: new Intl.DateTimeFormat(language, {
                timeZone: AGENCY_TIMEZONE,
                weekday: "long",
            }).format(timestamp),
        };
    });
};
