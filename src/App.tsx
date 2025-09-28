import { generateDarkScheme, ColorRole } from "material-color-lite";
import { createTheme, ThemeProvider } from "@mui/material";
import CheckUpdate from "./components/pages/CheckUpdate";
import Router from "./components/util/Router";
import useThemeStore from "@/hooks/useThemeStore";
import { useMemo } from "react";

export default () => {
    const color = useThemeStore((state) => state.color);
    const md3Theme = useMemo(
        () =>
            generateDarkScheme(color, [
                ColorRole.Primary,
                ColorRole.OnPrimary,
                ColorRole.PrimaryContainer,
                ColorRole.OnPrimaryContainer,
                ColorRole.Secondary,
                ColorRole.OnSecondary,
                ColorRole.Error,
                ColorRole.OnError,
                ColorRole.Background,
                ColorRole.OnBackground,
                ColorRole.OnSurface,
                ColorRole.InverseOnSurface,
            ]),
        [color]
    );

    const theme = createTheme({
        cssVariables: true,
        palette: {
            mode: "dark",
            primary: {
                main: md3Theme.onPrimary,
                contrastText: md3Theme.primary,
            },
            secondary: {
                main: md3Theme.onSecondary,
                contrastText: md3Theme.secondary,
            },
            error: {
                main: md3Theme.onError,
                contrastText: md3Theme.error,
            },
            background: {
                default: md3Theme.background,
                paper: md3Theme.inverseOnSurface,
            },
            text: {
                primary: md3Theme.onSurface,
            },
            action: {
                active: md3Theme.onBackground,
                hover: "hsla(0, 0%, 100%, 0.1)",
                selected: md3Theme.onPrimaryContainer,
                disabled: "hsla(0, 0%, 100%, 0.3)",
                disabledBackground: md3Theme.primary,
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
                            color: md3Theme.onPrimary,
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
                            backgroundColor: md3Theme.inverseOnSurface,
                            "& input": {
                                color: md3Theme.onBackground,
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
                        backgroundColor: md3Theme.primaryContainer,
                        boxShadow: "none",
                        transition: "border-radius 0.2s",
                        borderRadius: 24,
                        "&:hover": {
                            backgroundColor: md3Theme.primaryContainer,
                            boxShadow: "none",
                        },
                    },
                    text: {
                        backgroundColor: "transparent",
                        color: md3Theme.primary,
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    },
                    outlined: {
                        backgroundColor: md3Theme.primary,
                        "&:hover": {
                            backgroundColor: md3Theme.primary,
                        },
                    },
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        "&.Mui-checked": {
                            color: md3Theme.primary,
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        "&.Mui-checked": {
                            color: md3Theme.primary,
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        backgroundColor: md3Theme.onPrimary,
                        color: md3Theme.primary,
                        fontWeight: "bold",
                        "& .MuiSvgIcon-root": {
                            color: md3Theme.primary,
                        },
                        "&:hover": {
                            backgroundColor: md3Theme.onPrimary,
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
                        backgroundColor: md3Theme.primaryContainer,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: md3Theme.background,
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
                        color: md3Theme.primary,
                    },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    colorPrimary: {
                        backgroundColor: md3Theme.primary,
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
            MuiTabs: {
                styleOverrides: {
                    root: {
                        "& .MuiTabs-indicator": {
                            backgroundColor: md3Theme.primary,
                        },
                        "& .MuiTabs-scrollButtons.Mui-disabled": {
                            opacity: 0.3,
                        },
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        "&.Mui-selected": {
                            color: md3Theme.primary,
                        },
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        "&.Mui-focused": {
                            color: md3Theme.primary,
                        },
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
