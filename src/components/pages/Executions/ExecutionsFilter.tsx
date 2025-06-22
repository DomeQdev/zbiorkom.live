import { SearchState } from "@/hooks/useSearchState";
import { Box, Tab, Tabs, TextField } from "@mui/material";
import ExecutionsFilterVehicle from "./ExecutionsFilterVehicle";
import { useQueryExecutionDates } from "@/hooks/useQueryExecutions";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    city: string;
    date: SearchState;
    route: SearchState;
    brigade: SearchState;
    vehicle: SearchState;
    setLoading: (loading: boolean) => void;
};

const getLast30Days = (language: string) => {
    const locale = language === "en" ? "en-US" : "pl-PL";
    
    return Array.from({ length: 30 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);

        const dateString = date.toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        
        let dayName = date.toLocaleDateString(locale, {
            weekday: "long",
        });
        
        // Skróć poniedziałek do "poniedz." dla polskiego
        if (locale === "pl-PL" && dayName === "poniedziałek") {
            dayName = "poniedz.";
        }

        return [
            date.toISOString().split("T")[0],
            `${dateString}\n${dayName}`,
        ];
    });
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
    const last30Days = getLast30Days(i18n.language);

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
                {last30Days.map(([valueDate, displayDate]) => (
                    <Tab
                        key={valueDate}
                        label={displayDate}
                        value={valueDate}
                        disabled={!dates?.includes(valueDate)}
                        sx={{
                            whiteSpace: "pre-line",
                            textAlign: "center",
                            minHeight: "48px",
                            "& .MuiTab-wrapper": {
                                flexDirection: "column",
                            },
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
};
