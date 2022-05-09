import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItemButton, ListItemText, Divider, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { City } from "../util/typings";
import { Translate } from "../util/Translations";
import cities from "../util/cities.json";

export default () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("city")) return navigate(`/${localStorage.getItem("city")}`);
    }, []);

    return !localStorage.getItem("city") ? <Dialog
        open
        onClose={() => navigate("/")}
        scroll="paper"
        fullScreen
    >
        <DialogTitle><Translate name="select_city" /></DialogTitle>
        <DialogContent dividers>
            <List>
                {Object.keys(cities).map<React.ReactNode>((city) => (<ListItemButton onClick={() => {
                    localStorage.setItem("city", city);
                    navigate(`/${city}`);
                }}>
                    <ListItemText primary={cities[city as City].name} />
                    <NavigateNext />
                </ListItemButton>)).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])}
            </List>
        </DialogContent>
    </Dialog> : <p>Redirecting...</p>;
};