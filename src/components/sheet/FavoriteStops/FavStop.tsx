import useQueryStation from "@/hooks/useQueryStation";
import useQueryStop from "@/hooks/useQueryStop";
import StopTag from "@/ui/StopTag";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EStopDeparture, EStopDepartures, FavoriteStop } from "typings";
import Loading from "@/ui/Loading";
import { Edit } from "@mui/icons-material";
import FavDeparture from "./FavDeparture";
import { useTranslation } from "react-i18next";
import FavNotFound from "./FavNotFound";

export default ({ index, stop }: { index: number; stop: FavoriteStop }) => {
    const { t } = useTranslation("Schedules");
    const { data, isLoading } = useDepartures(stop);
    const navigate = useNavigate();
    const { city } = useParams();

    if (!data) {
        if (isLoading) return <Loading height={160} />;
        else return <FavNotFound index={index} stop={stop} />;
    }

    const url = `/${city}/${stop.isStation ? "station" : "stop"}/${stop.id}`;

    return (
        <ButtonBase
            component={Link}
            to={url}
            state={-2}
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 2,
                borderTop: index !== 0 ? "1px solid var(--mui-palette-divider)" : undefined,
                "& .favHeader": {
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "& .MuiIconButton-root": {
                        padding: 0,
                        width: 30,
                        height: 30,
                        "& svg": {
                            width: 20,
                            height: 20,
                        },
                    },
                },
            }}
        >
            <div className="favHeader">
                <StopTag stop={data[EStopDepartures.stop]} />

                <IconButton
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        navigate(`${url}/addToFav`);
                    }}
                >
                    <Edit />
                </IconButton>
            </div>

            <ButtonBase
                sx={{
                    backgroundColor: "var(--mui-palette-background-paper)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    borderRadius: 1,
                    padding: 1,
                    marginTop: 1,
                    gap: 1,
                    "& .vehicle": {
                        padding: "2px 6px",
                        fontSize: 15,
                    },
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`${url}#favOnly`, { state: -2 });
                }}
            >
                {!data[EStopDepartures.departures].length && t("noDepartures")}

                {data[EStopDepartures.departures].map((departure) => (
                    <FavDeparture key={`${stop.id}${departure[EStopDeparture.id]}`} departure={departure} />
                ))}
            </ButtonBase>
        </ButtonBase>
    );
};

const useDepartures = (stop: FavoriteStop) => {
    const { city } = useParams();

    const destinations = stop.directions.map((direction) => direction[0]);

    if (stop.isStation) {
        return useQueryStation({
            station: stop.id,
            limit: 3,
            wait: 250,
            destinations,
        });
    } else {
        return useQueryStop({
            city: city!,
            stop: stop.id,
            limit: 3,
            wait: 250,
            destinations,
        });
    }
};
