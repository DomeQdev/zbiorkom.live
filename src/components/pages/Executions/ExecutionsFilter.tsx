import { SearchState } from "@/hooks/useSearchState";
import { Box, TextField } from "@mui/material";
import ExecutionsFilterVehicle from "./ExecutionsFilterVehicle";
import { useQueryExecutionDates } from "@/hooks/useQueryExecutions";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DayPicker from "@/ui/DayPicker";

type Props = {
    city: string;
    date: SearchState;
    route: SearchState;
    brigade: SearchState;
    vehicle: SearchState;
    setLoading: (loading: boolean) => void;
};

export default ({
    city,
    date: [date, setDate],
    route: [route, setRoute],
    brigade: [brigade, setBrigade],
    vehicle: [vehicle, setVehicle],
    setLoading,
}: Props) => {
    const { t, i18n } = useTranslation("Executions");

    const { data: dates, isLoading } = useQueryExecutionDates({
        city,
        route,
        brigade,
        vehicle,
        enabled: !!route || !!(route && brigade) || !!vehicle,
    });

    const last30Days = useMemo(() => {
        return Array.from({ length: 30 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - index);

            const valueDate = date.toISOString().split("T")[0];

            return {
                valueDate,
                displayDate: date.toLocaleDateString(i18n.language, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                dayOfWeek: date.toLocaleDateString(i18n.language, {
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
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginX: 1,
                    gap: 1,
                }}
            >
                <TextField
                    size="small"
                    label={t("route")}
                    value={route}
                    onChange={({ target }) => setRoute(target.value)}
                    slotProps={{
                        input: {
                            autoComplete: "off",
                            autoCapitalize: "off",
                        },
                    }}
                />
                <TextField
                    size="small"
                    label={t("brigade")}
                    value={brigade}
                    onChange={({ target }) => setBrigade(target.value)}
                    slotProps={{
                        input: {
                            autoComplete: "off",
                            autoCapitalize: "off",
                        },
                    }}
                />
                <ExecutionsFilterVehicle vehicle={[vehicle, setVehicle]} />
            </Box>

            <DayPicker value={date} setValue={setDate} days={last30Days} enableScrollToNextAvailable />
        </Box>
    );
};
