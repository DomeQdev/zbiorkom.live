import { Box, SvgIcon, Typography } from "@mui/material";
import Icon, { defaultColors } from "./Icon";
import { EStop, Stop } from "typings";

export default ({ stop, fontSize = 16 }: { stop: Stop; fontSize?: number }) => {
    return (
        <Typography
            variant="h6"
            component="div"
            sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                fontSize,
                gap: 0.8,
                whiteSpace: "nowrap",
                minWidth: 0,
            }}
        >
            <SvgIcon
                sx={{
                    backgroundColor: defaultColors[stop[EStop.type]],
                    borderRadius: 0.5,
                    padding: 0.5,
                    width: fontSize * 1.8,
                    height: fontSize * 1.8,
                }}
            >
                <Icon type={stop[EStop.type]} />
            </SvgIcon>

            <Box
                component="span"
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {stop[EStop.name]}
            </Box>
        </Typography>
    );
};
