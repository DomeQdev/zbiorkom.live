import { List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { PanTool } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { Trip } from "../util/typings";
import { Translate } from "../util/Translations";
import { Result } from "../util/Realtime";

export default ({ trip, tripInfo }: { trip?: Trip, tripInfo?: Result }) => {
    const map = useMap();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setScrolled(false), [trip]);

    return <List>
        {tripInfo?.stops?.map<React.ReactNode>((stop, i) => (
            <ListItemButton key={stop.name} onClick={() => map.setView(stop.location, 17)} ref={(ref) => {
                if (!scrolled && (tripInfo?.serving?.id === stop?.id || (tripInfo?.nextStop.id === stop?.id && !tripInfo?.serving))) {
                    ref?.scrollIntoView();
                    setScrolled(true);
                }
            }}>
                <ListItemAvatar>
                    <Avatar sx={{ width: 15, height: 15, backgroundColor: stop?.metersToStop > -50 ? trip?.color : "#9ba1ab", color: "white", marginLeft: "5px", zIndex: 30000 }}>&nbsp;</Avatar>
                    {i + 1 !== tripInfo?.stops?.length ? <div style={{ borderLeft: `7px solid ${stop?.metersToStop > -50 || (tripInfo?.nextStop?.id === tripInfo?.stops[i + 1]?.id) ? trip?.color : "#9ba1ab"}`, marginLeft: '9px', marginTop: '-1px', height: '100%', position: 'absolute', paddingRight: '16px' }} /> : null}
                </ListItemAvatar>
                <ListItemText style={{ marginLeft: "-13px", marginRight: "1px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ color: stop?.metersToStop < -50 ? "#ADADAD" : "" }}>
                            <span style={{ fontWeight: tripInfo?.serving === stop || (tripInfo?.nextStop === stop && !tripInfo?.serving) ? "bold" : "" }}>{stop.on_request && <PanTool style={{ width: 15, height: 15 }} />} {stop.name}</span>
                            {stop?.metersToStop > -50 ? <span style={{ fontSize: 15 }}><br />{stop.platform ? <><Translate name="platform" /> <b>{stop.platform}</b></> : null}</span> : null}
                        </div>
                        {stop?.metersToStop > -50 && minutesUntil(stop.arrival + (tripInfo?.delay || 0) * 60000) < 60 ? <div>
                            <p style={{ margin: 0, lineHeight: 1.4, textAlign: "right" }}><span style={{ fontSize: 20, fontWeight: "bold" }}>{minutesUntil(stop.realTime) < 0.5 ? "<1" : minutesUntil(stop.realTime)}</span> min</p> 
                            <p style={{ color: "#737478", fontSize: 14, lineHeight: 1.4, margin: 0, textAlign: "right" }}>{tripInfo?.delay ? <s>{timeString(stop.arrival)}</s> : null} {timeString(stop.realTime)}</p>
                        </div> : null}
                    </div>
                </ListItemText>
            </ListItemButton>
        )).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={i} sx={{ backgroundColor: "#DCCDCD", marginRight: "10px", marginLeft: "57px" }} />, curr])}
    </List>;
};

function minutesUntil(timestamp: number) {
    return Math.round((timestamp - Date.now()) / 60000);
}

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}
