import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/util/fetchFunctions";
import { useState } from "react";
import { EExecution, Execution } from "typings";
import getTime from "@/util/getTime";
import VehicleDelay from "@/sheet/Vehicle/VehicleDelay";
import { Virtuoso } from "react-virtuoso";

export default () => {
    const navigate = useNavigate();
    const { city } = useParams();
    const [date, setDate] = useState<string | null>(null);
    const [route, setRoute] = useState<string | null>(null);
    const [brigade, setBrigade] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<string | null>(null);
    const [executions, setExecutions] = useState<Execution[]>([]);

    const { data: dates } = useQuery<string[]>({
        queryKey: ["executionDates", city],
        queryFn: () => fetchWithAuth(`${Gay.base}/${city}/tripExecutions/getDates`),
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    if (!dates) return null;

    return (
        <Dialog open fullScreen>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <IconButton onClick={() => navigate(window.location.pathname, { state: "menu" })}>
                    <Menu />
                </IconButton>
                Egzekucje
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        "& > p": {
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            margin: 0,
                        },
                    }}
                >
                    <p>
                        Wybierz datę:
                        <Select
                            value={date}
                            label="Data"
                            onChange={({ target }) => setDate(target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ width: 180 }}
                        >
                            {dates.map((date) => (
                                <MenuItem key={date} value={date}>
                                    {date}
                                </MenuItem>
                            ))}
                        </Select>
                    </p>
                    <p>
                        Linia:
                        <TextField
                            value={route}
                            onChange={({ target }) => setRoute(target.value)}
                            label="Linia"
                            variant="outlined"
                            size="small"
                            sx={{ width: 120 }}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                        />
                    </p>
                    <p>
                        Brygada:
                        <TextField
                            value={brigade}
                            onChange={({ target }) => setBrigade(target.value)}
                            label="Brygada"
                            variant="outlined"
                            size="small"
                            sx={{ width: 120 }}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                        />
                    </p>
                    <p>
                        Pojazd:
                        <TextField
                            value={vehicle}
                            onChange={({ target }) => setVehicle(target.value)}
                            label="Pojazd"
                            variant="outlined"
                            size="small"
                            sx={{ width: 120 }}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                        />
                        prefixy: {"0/ tramwaje, 2/ pociągi, 3/ autobusy, 11/ trolejbusy"}
                    </p>
                    <p>
                        <button
                            onClick={async () => {
                                if (!date) return alert("Wybierz datę");
                                if (!route && !brigade && !vehicle)
                                    return alert("Wybierz przynajmniej jeden filtr");
                                if (brigade && !route) return alert("Brygada musi być używana z linią");

                                fetchWithAuth<Execution[]>(
                                    `${Gay.base}/${city}/tripExecutions/getExecutions` +
                                        `?date=${date}` +
                                        (route ? `&route=${route}` : "") +
                                        (brigade ? `&brigade=${brigade}` : "") +
                                        (vehicle ? `&vehicle=${vehicle}` : "")
                                ).then((res) => {
                                    if (!res.length) return alert("Brak egzekucji");
                                    setExecutions(res);
                                });
                            }}
                        >
                            Sprawdź egzekucje
                        </button>
                    </p>
                </Box>

                {executions.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        <Typography>Znalazłem {executions.length} egzekucji!</Typography>

                        {/* {executions.map((execution) => (
                            <Box
                                key={execution[EExecution.gtfsTripId]}
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    padding: 1,
                                    border: "1px solid",
                                    borderRadius: 1,
                                    backgroundColor: "background.paper",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        "& > span": {
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 0.5,
                                        },
                                    }}
                                >
                                    <span>
                                        Pojazd: <b>{execution[EExecution.vehicleId]}</b>
                                    </span>
                                    <span>
                                        Linia/brygada:
                                        <b>
                                            {execution[EExecution.route] +
                                                (execution[EExecution.brigade]
                                                    ? `/${execution[EExecution.brigade]}`
                                                    : "")}
                                        </b>
                                    </span>
                                    <span>
                                        Start: <b>{execution[EExecution.startStopName]}</b>,{" "}
                                        {getTime(execution[EExecution.scheduledStartTime])},{" "}
                                        <VehicleDelay delay={execution[EExecution.startDelay]} />
                                    </span>
                                    <span>
                                        Koniec: <b>{execution[EExecution.endStopName]}</b>,{" "}
                                        {getTime(execution[EExecution.scheduledEndTime])},{" "}
                                        {execution[EExecution.endDelay] ? (
                                            <VehicleDelay delay={execution[EExecution.endDelay]} />
                                        ) : (
                                            "nie dojechał"
                                        )}
                                    </span>
                                </Typography>
                            </Box>
                        ))} */}
                        <Virtuoso
                            style={{ height: "60vh" }}
                            totalCount={executions.length}
                            itemContent={(index) => {
                                const execution = executions[index];
                                return (
                                    <Box
                                        key={execution[EExecution.gtfsTripId]}
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            padding: 1,
                                            border: "1px solid",
                                            borderRadius: 1,
                                            backgroundColor: "background.paper",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                "& > span": {
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                },
                                            }}
                                        >
                                            <span>
                                                Pojazd: <b>{execution[EExecution.vehicleId]}</b>
                                            </span>
                                            <span>
                                                Linia/brygada:
                                                <b>
                                                    {execution[EExecution.route] +
                                                        (execution[EExecution.brigade]
                                                            ? `/${execution[EExecution.brigade]}`
                                                            : "")}
                                                </b>
                                            </span>
                                            <span>
                                                Start: <b>{execution[EExecution.startStopName]}</b>,{" "}
                                                {getTime(execution[EExecution.scheduledStartTime])},{" "}
                                                <VehicleDelay delay={execution[EExecution.startDelay]} />
                                            </span>
                                            <span>
                                                Koniec: <b>{execution[EExecution.endStopName]}</b>,{" "}
                                                {getTime(execution[EExecution.scheduledEndTime])},{" "}
                                                {execution[EExecution.endDelay] ? (
                                                    <VehicleDelay delay={execution[EExecution.endDelay]} />
                                                ) : (
                                                    "nie dojechał"
                                                )}
                                            </span>
                                        </Typography>
                                    </Box>
                                );
                            }}
                        />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};
