import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import useData from "./useData";
import useGoBack from "@/hooks/useGoBack";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import StopTag from "@/ui/StopTag";
import StopSelector from "./StopSelector";
import useFavStore from "@/hooks/useFavStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import AddedDirections from "./AddedDirections";
import { EStop } from "typings";

export default () => {
    const { city, stop, station } = useParams();
    const { t } = useTranslation("Favorites");
    const id = (stop || station)!;
    const goBack = useGoBack();

    const [favorites, add, remove] = useFavStore(
        useShallow((state) => [state.favorites, state.addFavoriteDirection, state.removeFavoriteDirection])
    );
    const addedDirections = useMemo(
        () => favorites.find((fav) => fav.id === id)?.directions || [],
        [favorites]
    );

    const data = useData(city!, id, !!station);
    if (!data) return null;

    return (
        <Dialog open fullWidth onClose={() => goBack()}>
            <DialogTitle
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2 }}
            >
                <StopTag stop={data.info} />
                <IconButton onClick={() => goBack()}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1, padding: 2 }}>
                {addedDirections.length < 5 && (
                    <StopSelector
                        directions={data.directions?.filter(
                            (direction) => !addedDirections.some((fav) => fav[0] === direction[0])
                        )}
                        onAdd={(direction) => {
                            if (addedDirections.some((fav) => fav[0] === direction[0])) return;

                            add(id, data.info[EStop.location], !!station, [
                                direction[0],
                                `${direction[1]} ${direction[2] || ""}`.trim(),
                            ]);
                        }}
                    />
                )}

                <AddedDirections directions={addedDirections} onRemove={(index) => remove(id, index)} />

                {!addedDirections.length && (
                    <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                        {t("thanksToDirection")}
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};
