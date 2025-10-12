import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Fab, Fade } from "@mui/material";
import { ColorRole, generateDarkScheme } from "material-color-lite";
import { useMemo } from "react";

type Props = {
    scrollType?: "up" | "down" | false;
    color: string;
    onClick: () => void;
};

export default ({ scrollType, color, onClick }: Props) => {
    const { primaryContainer, onPrimaryContainer } = useMemo(
        () => generateDarkScheme(color, [ColorRole.PrimaryContainer, ColorRole.OnPrimaryContainer]),
        [color],
    );

    return (
        <Fade in={!!scrollType}>
            <Fab
                color="primary"
                size="small"
                sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    zIndex: 9999,
                    color: onPrimaryContainer,
                    backgroundColor: primaryContainer,
                    "&:hover": {
                        backgroundColor: primaryContainer,
                    },
                }}
                onClick={onClick}
            >
                {scrollType === "up" && <ArrowDropUp />}
                {scrollType === "down" && <ArrowDropDown />}
            </Fab>
        </Fade>
    );
};
