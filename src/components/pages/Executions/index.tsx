import { CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import useSearchState from "@/hooks/useSearchState";
import { useNavigate, useParams } from "react-router-dom";
import ExecutionsFilter from "./ExecutionsFilter";
import { ArrowBack, Dangerous, History } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useQueryExecutionAutocomplete, useQueryExecutions } from "@/hooks/useQueryExecutions";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import { EExecution, ERoute } from "typings";
import Execution from "./Execution";
import Alert from "@/ui/Alert";
import { getCityDate, getCityTimezone } from "@/util/tools";

import "./executions.css";

export default () => {
    const { t } = useTranslation("Executions");
    const { t: tShared } = useTranslation("Shared");
    const navigate = useNavigate();
    const { city } = useParams();

    const [date, setDate] = useSearchState("date", getCityDate(Date.now(), getCityTimezone(city)));
    const [route, setRoute] = useSearchState("route", "");
    const [brigade, setBrigade] = useSearchState("brigade", "");
    const [vehicle, setVehicle] = useSearchState("vehicle", "");
    const enabled = !!route || !!vehicle;

    const [filterLoading, setFilterLoading] = useState(false);

    const { data: autocomplete } = useQueryExecutionAutocomplete(city!);
    const routesMap = useMemo(
        () => new Map((autocomplete?.routes ?? []).map((r) => [r[ERoute.id], r])),
        [autocomplete],
    );

    const {
        data: executions,
        isLoading,
        error,
    } = useQueryExecutions({
        city: city!,
        date,
        route,
        brigade,
        vehicle,
        enabled: !!date && enabled,
    });

    const loading = filterLoading || isLoading;

    return (
        <Dialog
            open
            onClose={() => navigate(`/${city}`)}
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
                    <IconButton onClick={() => navigate(`/${city}`)}>
                        <ArrowBack />
                    </IconButton>
                    {t("executions")}
                </div>
                <div>
                    <CircularProgress
                        size="small"
                        sx={{
                            visibility: loading ? "visible" : "hidden",
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
                {!enabled && <Alert title={t("noFilter")} Icon={History} color="error" />}

                {enabled && !loading && error && (
                    <Alert
                        title={tShared("loadError")}
                        description={String((error as Error).message ?? error)}
                        Icon={Dangerous}
                        color="error"
                    />
                )}

                {enabled && !loading && !error && !executions?.length && (
                    <Alert
                        title={t("noResults")}
                        description={t("noResultsDescription")}
                        Icon={Dangerous}
                        color="error"
                    />
                )}

                {!!executions?.length && (
                    <Virtuoso
                        style={{ height: "100%" }}
                        totalCount={executions.length}
                        itemContent={(index) => (
                            <Execution
                                execution={executions[index]}
                                route={routesMap.get(executions[index][EExecution.route])}
                                city={city!}
                                date={date}
                            />
                        )}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
