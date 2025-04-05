import getColors, { hexFromArgb } from "@/util/getColors";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Fab, Fade } from "@mui/material";

type Props = {
    scrollType?: "up" | "down" | false;
    color: string;
    onClick: () => void;
};

export default ({ scrollType, color, onClick }: Props) => {
    const { primaryContainer, onPrimaryContainer } = getColors(color);

    const text = hexFromArgb(onPrimaryContainer);
    const background = hexFromArgb(primaryContainer);

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
                    color: text,
                    backgroundColor: background,
                    "&:hover": {
                        backgroundColor: background,
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
