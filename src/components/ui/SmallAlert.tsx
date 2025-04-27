import { CheckCircle, Dangerous, Info, Warning } from "@mui/icons-material";
import { Box, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type Props = {
    type: "error" | "warning" | "info" | "success";
    text: string;
};

const dictionary = {
    error: {
        icon: Dangerous,
        backgroundColor: "#690005",
        textColor: "#ffb4ab",
    },
    warning: {
        icon: Warning,
        backgroundColor: "#3a3000",
        textColor: "#dbc66e",
    },
    info: {
        icon: Info,
        backgroundColor: "#0a305f",
        textColor: "#aac7ff",
    },
    success: {
        icon: CheckCircle,
        backgroundColor: "#1f3701",
        textColor: "#b1d18a",
    },
} as Record<
    Props["type"],
    { icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>; backgroundColor: string; textColor: string }
>;

export default ({ type, text }: Props) => {
    const { icon: Icon, backgroundColor, textColor } = dictionary[type];

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "1px 5px",
                backgroundColor,
                color: textColor,
                borderRadius: 0.5,
                fontSize: 15,
                fontWeight: "bold",
            }}
        >
            <Icon fontSize="small" />
            {text}
        </Box>
    );
};
