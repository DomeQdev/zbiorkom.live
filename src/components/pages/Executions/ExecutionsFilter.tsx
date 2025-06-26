import { SearchState } from "@/hooks/useSearchState";
import { Box, Tab, Tabs, TextField } from "@mui/material";
import ExecutionsFilterVehicle from "./ExecutionsFilterVehicle";
import { useQueryExecutionDates } from "@/hooks/useQueryExecutions";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

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

    const last30Days = useMemo(
        () =>
            Array.from({ length: 30 }, (_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - index);

                return {
                    valueDate: date.toISOString().split("T")[0],
                    displayDate: date.toLocaleDateString(i18n.language, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                    dayOfWeek: date.toLocaleDateString(i18n.language, {
                        weekday: "long",
                    }),
                };
            }),
        [i18n.language]
    );
    const { data: dates, isLoading } = useQueryExecutionDates({
        city,
        route,
        brigade,
        vehicle,
        enabled: !!route || !!(route && brigade) || !!vehicle,
    });

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

            <Tabs
                value={date}
                onChange={(_, newValue) => setDate(newValue)}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                {last30Days.map(({ valueDate, displayDate, dayOfWeek }) => (
                    <Tab
                        key={valueDate}
                        label={
                            <Box>
                                {displayDate}
                                <Box
                                    sx={{
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {dayOfWeek}
                                </Box>
                            </Box>
                        }
                        value={valueDate}
                        disabled={!dates?.includes(valueDate)}
                        sx={{ textTransform: "none" }}
                    />
                ))}
            </Tabs>
        </Box>
    );
};
