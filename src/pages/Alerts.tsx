import { Dialog, DialogTitle, DialogContent, Divider, List, ListItemButton, ListItemText, IconButton } from "@mui/material";
import { Translate } from "../util/Translations";
import { Link, useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { Alert } from "../util/typings"

export default ({ alerts }: { alerts: Alert[] }) => {
    const navigate = useNavigate();

    return <Dialog
        open
        onClose={() => navigate("../")}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Translate name="alerts" /><IconButton onClick={() => navigate("../")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            <List>
                {alerts.map<React.ReactNode>((alert, i) => (<ListItemButton key={i}>
                    <ListItemText style={{ marginLeft: "-13px", marginRight: "1px", color: "-webkit-link", cursor: "pointer", textDecoration: "underline" }} onClick={() => window.open(alert.link, "_blank")}>
                        {alert.title}
                    </ListItemText>
                </ListItemButton>)).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])}
            </List>
        </DialogContent>
    </Dialog>;
};