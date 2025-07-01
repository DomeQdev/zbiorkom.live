import { KeyboardArrowDown } from "@mui/icons-material";
import { Box, Collapse, ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { ReactElement, ReactNode, useState } from "react";

type Props = {
    icon: ReactElement;
    title: string;
    open?: boolean;
    sx?: SxProps;
    children: ReactNode;
};

export default ({ icon, title, open, sx, children }: Props) => {
    const [isExpanded, setExpanded] = useState<boolean>(open || false);

    return (
        <Box sx={sx}>
            <ListItemButton
                onClick={() => setExpanded(!isExpanded)}
                sx={{
                    borderRadius: 1,
                    backgroundColor: "background.paper",
                    borderBottomLeftRadius: !isExpanded ? 12 : 4,
                    borderBottomRightRadius: !isExpanded ? 12 : 4,
                    transition: "border-radius 0.2s ease-in-out",
                    "&:hover": {
                        backgroundColor: "background.paper",
                    },
                }}
            >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} sx={{ ml: -2 }} />

                <KeyboardArrowDown
                    sx={{
                        transform: isExpanded ? "rotate(180deg)" : undefined,
                        transition: "transform 0.2s ease-in-out",
                    }}
                />
            </ListItemButton>

            <Collapse in={isExpanded} easing="ease-in-out" timeout={150}>
                <Box
                    sx={{
                        mt: 0.4,
                        backgroundColor: "background.paper",
                        borderTopLeftRadius: isExpanded ? 4 : 12,
                        borderTopRightRadius: isExpanded ? 4 : 12,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        transition: "border-radius 0.2s ease-in-out",
                        px: 1.5,
                        py: 1,
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};
