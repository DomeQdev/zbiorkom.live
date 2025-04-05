import { Box, Button, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

export default () => {
    return (
        <>
            <Helmet>
                <meta name="robots" content="noindex" />
            </Helmet>

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
