import { Box, SvgIconTypeMap, SxProps, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type Props = {
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    title: string;
    description?: string;
    color?: string;
    sx?: SxProps;
};

export default ({ Icon, title, description, color = "primary", sx }: Props) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100% - 120px)",
                ...sx,
            }}
        >
            <Icon
                sx={{
                    color: `${color}.contrastText`,
                    backgroundColor: `${color}.main`,
                    padding: 2,
                    margin: 1,
                    borderRadius: 2,
                    width: 64,
                    height: 64,
                }}
            />
            <Typography variant="h6">{title}</Typography>
            {description && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {description}
                </Typography>
            )}
        </Box>
    );
};
