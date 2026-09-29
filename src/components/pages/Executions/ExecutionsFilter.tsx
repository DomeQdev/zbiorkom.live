import { SearchState } from "@/hooks/useSearchState";
import { Autocomplete, Box, TextField, createFilterOptions } from "@mui/material";
import {
    useQueryExecutionAutocomplete,
    useQueryExecutionBrigades,
    useQueryExecutionDates,
} from "@/hooks/useQueryExecutions";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ERoute, Route } from "typings";
import DayPicker from "@/ui/DayPicker";
import RouteChip from "@/ui/RouteChip";

type Props = {
    city: string;
    date: SearchState;
    route: SearchState;
    brigade: SearchState;
    vehicle: SearchState;
    setLoading: (loading: boolean) => void;
};

const routeFilter = createFilterOptions<Route>({
    limit: 50,
    stringify: (route) => `${route[ERoute.name]} ${route[ERoute.longName]}`,
});

const listFilter = createFilterOptions<string>({ limit: 50 });

export default ({
    city,
    date: [date, setDate],
    route: [route, setRoute],
    brigade: [brigade, setBrigade],
    vehicle: [vehicle, setVehicle],
    setLoading,
}: Props) => {
    const { t, i18n } = useTranslation("Executions");

    const { data: autocomplete } = useQueryExecutionAutocomplete(city);
    const { data: brigades } = useQueryExecutionBrigades(city, route);

    const routesMap = useMemo(
        () => new Map((autocomplete?.routes ?? []).map((r) => [r[ERoute.id], r])),
        [autocomplete],
    );

    const { data: dates, isLoading } = useQueryExecutionDates({
        city,
        route,
        brigade,
        vehicle,
        enabled: !!route || !!vehicle,
    });

    const last30Days = useMemo(() => {
        return Array.from({ length: 30 }, (_, index) => {
            const day = new Date();
            day.setDate(day.getDate() - index);

            const valueDate = day.toISOString().split("T")[0];

            return {
                valueDate,
                displayDate: day.toLocaleDateString(i18n.language, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                dayOfWeek: day.toLocaleDateString(i18n.language, {
                    weekday: "long",
                }),
                disabled: !dates?.includes(valueDate),
            };
        });
    }, [i18n.language, dates]);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginX: 1,
                    gap: 1,
                }}
            >
                <Autocomplete
                    size="small"
                    sx={{ flex: 1, minWidth: 140 }}
                    options={autocomplete?.routes ?? []}
                    value={routesMap.get(route) ?? null}
                    filterOptions={routeFilter}
                    autoHighlight
                    getOptionLabel={(option) => option[ERoute.name]}
                    isOptionEqualToValue={(option, value) => option[ERoute.id] === value[ERoute.id]}
                    onChange={(_, value) => {
                        setRoute(value ? value[ERoute.id] : "");
                        setBrigade("");
                    }}
                    renderOption={(props, option) => {
                        const { key, ...rest } = props as typeof props & { key: string };
                        return (
                            <Box component="li" key={key} {...rest}>
                                <RouteChip route={option} style={{ width: "100%" }} />
                            </Box>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} label={t("route")} autoComplete="off" />}
                />

                <Autocomplete
                    size="small"
                    sx={{ flex: 1, minWidth: 110 }}
                    options={brigades?.brigades ?? []}
                    value={brigade || null}
                    disabled={!route}
                    autoHighlight
                    onChange={(_, value) => setBrigade(value ?? "")}
                    renderInput={(params) => (
                        <TextField {...params} label={t("brigade")} autoComplete="off" />
                    )}
                />

                <Autocomplete
                    size="small"
                    sx={{ flex: 1, minWidth: 120 }}
                    options={autocomplete?.vehicles ?? []}
                    value={vehicle || null}
                    filterOptions={listFilter}
                    autoHighlight
                    onChange={(_, value) => setVehicle(value ?? "")}
                    renderInput={(params) => (
                        <TextField {...params} label={t("vehicle")} autoComplete="off" />
                    )}
                />
            </Box>

            <DayPicker value={date} setValue={setDate} days={last30Days} enableScrollToNextAvailable />
        </Box>
    );
};
