import StopTag from "@/ui/StopTag";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EStopDeparture, EStopDepartures, ETrip, FavoriteStop } from "typings";
import Loading from "@/ui/Loading";
import { Delete, FilterAlt, FilterAltOutlined, SubdirectoryArrowRight } from "@mui/icons-material";
import FavDeparture from "./FavDeparture";
import { useTranslation } from "react-i18next";
import FavNotFound from "./FavNotFound";
import { useQueryStopDepartures } from "@/hooks/useQueryStops";
import useFavStore from "@/hooks/useFavStore";

export default ({ index, stop }: { index: number; stop: FavoriteStop }) => {
    const { t } = useTranslation("Schedules");
    const { t: tFav } = useTranslation("Favorites");
    const navigate = useNavigate();
    const { city } = useParams();
    const removeFavoriteStop = useFavStore((state) => state.removeFavoriteStop);

    const { data, isLoading } = useQueryStopDepartures({
        city: stop.isStation ? "pkp" : city!,
        stop: stop.id,
        limit: 3,
        wait: 250,
        destinations: stop.directions.map((direction) => direction[0]),
        isMainComponent: true,
    });

    if (!data?.[EStopDepartures.stop]) {
        if (isLoading) return <Loading height={160} />;
        else return <FavNotFound index={index} stop={stop} />;
    }

    const path = `/${city}/${stop.isStation ? "station" : "stop"}/${stop.id}`;
    const search = stop.isStation && city !== "pkp" ? "?city=pkp" : "";
    const url = path + search;
    const isFiltered = stop.directions.length > 0;

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

                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        aria-label={tFav("editDirections")}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            navigate(`${path}/addToFav${search}`, { state: -2 });
                        }}
                    >
                        {isFiltered ? <FilterAlt /> : <FilterAltOutlined />}
                    </IconButton>

                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            removeFavoriteStop(stop.id);
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            </div>

            {isFiltered && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        marginTop: 0.5,
                        fontSize: 13,
                        color: "text.secondary",
                        width: "100%",
                        minWidth: 0,
                        "& svg": { width: 16, height: 16 },
                        "& span": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                    }}
                >
                    <SubdirectoryArrowRight />
                    <span>{stop.directions.map((direction) => direction[1]).join(", ")}</span>
                </Box>
            )}

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
            >
                {!data?.[EStopDepartures.departures]?.length && t("noDepartures")}

                {data?.[EStopDepartures.departures]?.map((departure) => (
                    <FavDeparture
                        key={`${stop.id}${departure[EStopDeparture.trip][ETrip.id]}`}
                        departure={departure}
                    />
                ))}
            </ButtonBase>
        </ButtonBase>
    );
};
