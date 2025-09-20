import { Box, ButtonBase, DialogTitle, IconButton, Typography } from "@mui/material";
import { AccessTime, ArrowBack, Refresh, Settings, SwapVert } from "@mui/icons-material";
import useTripPlannerStore from "@/hooks/useTripPlannerStore";
import { useShallow } from "zustand/react/shallow";
import SearchField from "./SearchField";

type Props = {
    isLoading: boolean;
    refresh: () => void;
    onClose: () => void;
};

export default ({ isLoading, refresh, onClose }: Props) => {
    const switchPlaces = useTripPlannerStore(useShallow((state) => state.switchPlaces));

    return (
        <>
            <DialogTitle
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "primary.main",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    paddingBottom: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="span"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <IconButton onClick={onClose}>
                        <ArrowBack />
                    </IconButton>
                    MPPdZPiR ✨
                </Typography>

                <Typography sx={{ color: "text.secondary", fontSize: 8, marginTop: -1 }}>
                    (Multimodalny Planer Podróży dla Zbiorkomu, Pociągów i Rowerów)
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <SearchField type="from" />
                        <SearchField type="to" />
                    </Box>

                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            right: 16,
                            borderRadius: 0,
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                            backgroundColor: "primary.main",
                            "&:hover": {
                                backgroundColor: "primary.main",
                            },
                        }}
                        onClick={switchPlaces}
                    >
                        <SwapVert />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "90%",
                    marginX: "auto",
                    marginTop: -2.5,
                    "& .MuiButtonBase-root": {
                        backgroundColor: "primary.dark",
                        color: "hsla(0, 0%, 100%, 0.87)",
                        borderColor: "primary.main",
                        borderStyle: "solid",
                        borderRadius: 2,
                        borderWidth: 2,
                    },
                    "& .MuiButtonBase-root:hover": {
                        backgroundColor: "primary.dark",
                    },
                }}
            >
                <ButtonBase
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 1,
                        gap: 0.5,
                    }}
                >
                    <AccessTime fontSize="small" />
                    Wyjazd: <span style={{ fontWeight: "bold" }}>Teraz</span>
                </ButtonBase>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <IconButton>
                        <Settings fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={refresh}
                        sx={{
                            animation: isLoading ? "spin 1s linear infinite" : "none",
                            pointerEvents: isLoading ? "none" : "auto",
                        }}
                    >
                        <Refresh fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
};
