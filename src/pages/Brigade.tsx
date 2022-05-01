import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Divider, ListItem, ListItemText, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { City, Vehicle } from "../util/typings";
import cities from "../util/cities.json";

export default ({ city, vehicle }: {
    city: City,
    vehicle: Vehicle
}) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [trips, setTrips] = useState<[{ trip: string, headsign: string, start: number, end: number }]>();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!cities[city].functions.brigades) {
            toast.error(`Przepraszamy, funkcja nie dostępna dla tego miasta.`);
            return navigate("../");
        }
        fetch(cities[city].api.brigade!.replace("{{line}}", vehicle.line).replace("{{brigade}}", vehicle.brigade!)).then(res => res.json()).then(data => {
            if (data.error) {
                toast.error("Nie znaleziono rozkładu brygad.")
                return navigate("../");
            }
            setTrips(data);
        });
    }, []);

    useEffect(() => {
        let tripId = searchParams.get("trip");
        if (!tripId) return;
    }, [searchParams.get("trip")]);

    return <Dialog
        open
        onClose={() => navigate("../")}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Rozkład brygady <b>{vehicle.line}</b>/<small>{vehicle.brigade}</small></span><IconButton onClick={() => navigate("../")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            {trips?.length ? trips?.map<React.ReactNode>(trip => (<ListItem button key={trip.trip} ref={(ref) => {
                if (!scrolled && trip.trip === vehicle.trip) {
                    ref?.scrollIntoView();
                    setScrolled(true);
                }
            }} onClick={() => {
                if(trip.trip === vehicle.trip) return;
                setSearchParams(`trip=${trip.trip}`);
            }}>
                <ListItemText style={{ marginLeft: "-13px", marginRight: "1px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: trip.trip === vehicle.trip ? "bold" : "" }}>
                        <div>
                            {trip.headsign}
                        </div>
                        <div>
                            {timeString(trip.start)}
                        </div>
                    </div>
                </ListItemText>
            </ListItem>)).reduce((prev, curr, i) => [prev, <Divider key={i} textAlign="left" style={{ color: "#9ba1ab", fontSize: 14 }}>{(trips[i].start - trips[i - 1]!.end) / 60000 < 60 ? `Postój ${(trips[i].start - trips[i - 1]!.end) / 60000} min` : null}</Divider>, curr]) : "Nic tu nie ma..."}
        </DialogContent>
    </Dialog>;
};

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}