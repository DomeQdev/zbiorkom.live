import { Box, ButtonBase, DialogTitle, IconButton, Typography } from "@mui/material";
import { AccessTime, ArrowBack, SwapVert } from "@mui/icons-material";
import SearchField from "./SearchField";
import { DirectionsPlace } from "..";

type Props = {
    from: [DirectionsPlace, (place: DirectionsPlace) => void];
    to: [DirectionsPlace, (place: DirectionsPlace) => void];
    onClose: () => void;
};

export default ({ from, to, onClose }: Props) => {
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
                        <SearchField type="start" place={from} />
                        <SearchField type="end" place={to} />
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
                        onClick={() => {
                            const [startPlace, setStart] = from;
                            const [endPlace, setEnd] = to;

                            setStart(endPlace);
                            setEnd(startPlace);
                        }}
                    >
                        <SwapVert />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Box
                sx={{
                    width: "90%",
                    marginX: "auto",
                    marginTop: -2,
                }}
            >
                <ButtonBase
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "primary.dark",
                        color: "hsla(0, 0%, 100%, 0.87)",
                        borderRadius: 2,
                        padding: 1,
                        gap: 0.5,
                    }}
                >
                    <AccessTime fontSize="small" />
                    Wyjazd: <span style={{ fontWeight: "bold" }}>Teraz</span>
                </ButtonBase>
            </Box>
        </>
    );
};
