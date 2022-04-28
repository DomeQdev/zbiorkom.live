import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Divider, ListItem, ListItemText, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { City } from "../util/typings";
import cities from "../util/cities.json";

export default ({ city, line, brigade }: {
    city: City,
    line: string,
    brigade: string
}) => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<[{ trip: string, headsign: string, start: number, end: number }]>();

    useEffect(() => {
        if (!cities[city].functions.brigades || !cities[city].api.brigade) {
            toast.error(`Przepraszamy, funkcja nie dostępna dla tego miasta.`);
            return navigate("../");
        }
        fetch(cities[city].api.brigade!.replace("{{line}}", line).replace("{{brigade}}", brigade)).then(res => res.json()).then(data => {
            if (data.error) {
                toast.error("Nie znaleziono rozkładu brygad.")
                return navigate("../");
            }
            setTrips(data);
        });
    }, []);

    return <Dialog
        open
        onClose={() => navigate("../")}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Rozkład brygady <b>{line}</b>/<small>{brigade}</small></span><IconButton onClick={() => navigate("../")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            {trips?.map<React.ReactNode>(trip => (<ListItem button key={trip.trip}>
                <ListItemText style={{ marginLeft: "-13px", marginRight: "1px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            {trip.headsign}
                        </div>
                        <div>
                            {timeString(trip.start)}
                        </div>
                    </div>
                </ListItemText>
            </ListItem>)).reduce((prev, curr) => [prev, <Divider key={Math.random()} />, curr])}
        </DialogContent>
    </Dialog>;
};

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}