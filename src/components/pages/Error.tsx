import { Box, Button, Typography } from "@mui/material";

export default () => {
    return (
        <>
            <meta name="robots" content="noindex" />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 4,
                }}
            >
                <Typography variant="h4">Ups!</Typography>
                <Typography variant="body1">Coś poszło nie tak.</Typography>
                <Button
                    variant="contained"
                    sx={(theme) => ({
                        marginTop: 2,
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.contrastText,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.contrastText,
                        },
                    })}
                    onClick={() => window.location.reload()}
                >
                    Odśwież
                </Button>
                <Button
                    variant="contained"
                    sx={(theme) => ({
                        marginTop: 2,
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.contrastText,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.contrastText,
                        },
                    })}
                    onClick={() => (window.location.href = "/")}
                >
                    Wróć do strony głównej
                </Button>
            </Box>
        </>
    );
};
