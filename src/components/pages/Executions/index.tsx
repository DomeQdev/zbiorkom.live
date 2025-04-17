import useGoBack from "@/hooks/useGoBack";
import useSearchState from "@/hooks/useSearchState";
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ExecutionsFilter from "./ExecutionsFilter";
import { ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import { useQueryExecutions } from "@/hooks/useQueryExecutions";
import { Virtuoso } from "react-virtuoso";
import { EExecution } from "typings";
import VehicleDelay from "@/sheet/Vehicle/VehicleDelay";
import getTime from "@/util/getTime";

export default () => {
    const { city } = useParams();
    const goBack = useGoBack();

    const [date, setDate] = useSearchState("date", new Date().toISOString().split("T")[0]);
    const [route, setRoute] = useSearchState("route", "");
    const [brigade, setBrigade] = useSearchState("brigade", "");
    const [vehicle, setVehicle] = useSearchState("vehicle", "");

    const [filterLoading, setFilterLoading] = useState(false);

    const { data: executions, isLoading } = useQueryExecutions({
        city: city!,
        date,
        route,
        brigade,
        vehicle,
        enabled: !!date && (!!route || !!(route && brigade) || !!vehicle),
    });

    return (
        <Dialog
            open
            onClose={() => goBack()}
            fullWidth={window.innerWidth > 600}
            fullScreen={window.innerWidth <= 600}
            sx={(theme) => ({
                "& .MuiDialog-paper": {
                    [theme.breakpoints.up("sm")]: {
                        height: "70%",
                    },
                },
            })}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "& div": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    },
                }}
            >
                <div>
                    <IconButton onClick={() => goBack()}>
                        <ArrowBack />
                    </IconButton>
                    Egzekucje
                </div>
                <div>
                    <CircularProgress
                        size="small"
                        sx={{
                            visibility: filterLoading || isLoading ? "visible" : "hidden",
                            width: 24,
                        }}
                    />
                </div>
            </DialogTitle>

            <ExecutionsFilter
                city={city!}
                date={[date, setDate]}
                route={[route, setRoute]}
                brigade={[brigade, setBrigade]}
                vehicle={[vehicle, setVehicle]}
                setLoading={setFilterLoading}
            />

            <DialogContent sx={{ padding: 0 }}>
                {!!executions?.length && (
                    <Virtuoso
                        style={{ height: "100%" }}
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
                )}
            </DialogContent>
        </Dialog>
    );
};
