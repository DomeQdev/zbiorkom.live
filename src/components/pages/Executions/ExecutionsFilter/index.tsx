import { SearchState } from "@/hooks/useSearchState";
import { Box, InputAdornment, MenuItem, Select, Tab, Tabs, TextField } from "@mui/material";
import ExecutionsFilterVehicle from "./ExecutionsFilterVehicle";
import { useQueryExecutionDates } from "@/hooks/useQueryExecutions";
import { useEffect } from "react";

type Props = {
    city: string;
    date: SearchState;
    route: SearchState;
    brigade: SearchState;
    vehicle: SearchState;
    setLoading: (loading: boolean) => void;
};

const last30Days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);

    return [
        date.toISOString().split("T")[0],
        date.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    ];
});

export default ({
    city,
    date: [date, setDate],
    route: [route, setRoute],
    brigade: [brigade, setBrigade],
    vehicle: [vehicle, setVehicle],
    setLoading,
}: Props) => {
    const { data: dates, isLoading } = useQueryExecutionDates({
        city,
        route,
        brigade,
        vehicle,
        enabled: !!route || !!(route && brigade) || !!vehicle,
    });

    useEffect(() => {
        if (!dates?.includes(date)) {
            setDate(dates?.[0] ?? "");
        }
    }, [dates]);

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
                    label="Linia"
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
                    label="Brygada"
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
                    />
                ))}
            </Tabs>
        </Box>
    );
};
