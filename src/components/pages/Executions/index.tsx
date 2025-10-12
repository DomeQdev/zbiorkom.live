import { CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import useSearchState from "@/hooks/useSearchState";
import { useNavigate, useParams } from "react-router-dom";
import ExecutionsFilter from "./ExecutionsFilter";
import { ArrowBack, Dangerous, History } from "@mui/icons-material";
import { useState } from "react";
import { useQueryExecutions } from "@/hooks/useQueryExecutions";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import Execution from "./Execution";

import "../Brigades/brigades.css";
import Alert from "@/ui/Alert";

export default () => {
    const { t } = useTranslation("Executions");
    const navigate = useNavigate();
    const { city } = useParams();

    const [date, setDate] = useSearchState("date", new Date().toISOString().split("T")[0]);
    const [route, setRoute] = useSearchState("route", "");
    const [brigade, setBrigade] = useSearchState("brigade", "");
    const [vehicle, setVehicle] = useSearchState("vehicle", "");
    const enabled = !!route || !!(route && brigade) || !!vehicle;

    const [filterLoading, setFilterLoading] = useState(false);

    const { data: executions, isLoading } = useQueryExecutions({
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

                {enabled && !loading && !executions?.length && (
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
                        itemContent={(index) => <Execution execution={executions[index]} />}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
