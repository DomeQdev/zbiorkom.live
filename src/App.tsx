import { createTheme, ThemeProvider } from "@mui/material";
import CheckUpdate from "./components/pages/CheckUpdate";
import useTheme from "./components/hooks/useTheme";
import Router from "./components/util/Router";
import { hexFromArgb } from "@/util/getColors";

export default () => {
    const md3Theme = useTheme();

    const theme = createTheme({
        cssVariables: true,
        palette: {
            mode: "dark",
            primary: {
                main: hexFromArgb(md3Theme.onPrimary),
                contrastText: hexFromArgb(md3Theme.primary),
            },
            secondary: {
                main: hexFromArgb(md3Theme.onSecondary),
                contrastText: hexFromArgb(md3Theme.secondary),
            },
            error: {
                main: hexFromArgb(md3Theme.onError),
                contrastText: hexFromArgb(md3Theme.error),
            },
            background: {
                default: hexFromArgb(md3Theme.background),
                paper: hexFromArgb(md3Theme.inverseOnSurface),
            },
            text: {
                primary: hexFromArgb(md3Theme.onSurface),
            },
            action: {
                active: hexFromArgb(md3Theme.onBackground),
                hover: "hsla(0, 0%, 100%, 0.1)",
                selected: hexFromArgb(md3Theme.onPrimaryContainer),
                disabled: "hsla(0, 0%, 100%, 0.3)",
                disabledBackground: hexFromArgb(md3Theme.primary),
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiFab: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        textTransform: "none",
                        "&.Mui-disabled": {
                            color: hexFromArgb(md3Theme.onPrimary),
                        },
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 24,
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiInputBase-root": {
                            borderRadius: 24,
                        },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: hexFromArgb(md3Theme.inverseOnSurface),
                            "& input": {
                                color: hexFromArgb(md3Theme.onBackground),
                            },
                            "& fieldset": {
                                borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                                borderColor: "transparent",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "transparent",
                            },
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        backgroundColor: hexFromArgb(md3Theme.primaryContainer),
                        boxShadow: "none",
                        transition: "border-radius 0.2s",
                        borderRadius: 24,
                        "&:hover": {
                            backgroundColor: hexFromArgb(md3Theme.primaryContainer),
                            boxShadow: "none",
                        },
                    },
                    text: {
                        backgroundColor: "transparent",
                        color: hexFromArgb(md3Theme.primary),
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    },
                    outlined: {
                        backgroundColor: hexFromArgb(md3Theme.primary),
                        "&:hover": {
                            backgroundColor: hexFromArgb(md3Theme.primary),
                        },
                    },
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        "&.Mui-checked": {
                            color: hexFromArgb(md3Theme.primary),
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        "&.Mui-checked": {
                            color: hexFromArgb(md3Theme.primary),
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        backgroundColor: hexFromArgb(md3Theme.onPrimary),
                        color: hexFromArgb(md3Theme.primary),
                        fontWeight: "bold",
                        "& .MuiSvgIcon-root": {
                            color: hexFromArgb(md3Theme.primary),
                        },
                        "&:hover": {
                            backgroundColor: hexFromArgb(md3Theme.onPrimary),
                            "& span": {
                                textDecoration: "line-through",
                            },
                        },
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: hexFromArgb(md3Theme.primaryContainer),
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: hexFromArgb(md3Theme.background),
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        padding: 12,
                    },
                },
            },
            MuiCircularProgress: {
                styleOverrides: {
                    colorPrimary: {
                        color: hexFromArgb(md3Theme.primary),
                    },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    colorPrimary: {
                        backgroundColor: hexFromArgb(md3Theme.primary),
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    list: {
                        padding: 0,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        padding: "8px 12px",
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Router />
            <CheckUpdate />
        </ThemeProvider>
    );
};
