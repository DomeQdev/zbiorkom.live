import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

type Props = {
    icon: JSX.Element;
    outlinedIcon: JSX.Element;
    name: string;
    active: boolean;
    onClick: () => void;
};

export default ({ icon, outlinedIcon, name, active, onClick }: Props) => {
    return (
        <ListItemButton
            sx={{
                backgroundColor: active ? "primary.main" : "transparent",
                color: "hsla(0, 0%, 100%, 0.9)",
                borderRadius: 2,
                pointerEvents: active ? "none" : "auto",
                padding: "6px 16px",
                transition: "background-color 0.3s",
            }}
            onClick={onClick}
        >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {active ? icon : outlinedIcon}
            </ListItemIcon>
            <ListItemText primary={name} />
        </ListItemButton>
    );
};
