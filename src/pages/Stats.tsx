import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { City, Vehicle } from "../util/typings"

export default ({ city, vehicles }: {
    city: City,
    vehicles: Vehicle[]
}) => {
    const navigate = useNavigate();

    return <Dialog
        open
        onClose={() => navigate(`/${city}`)}
        scroll="paper"
        fullWidth
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Statystyki</span><IconButton onClick={() => navigate(`/${city}`)}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            BUS: {vehicles.filter(v => v.type === "bus").length}<br />
            TRAM: {vehicles.filter(v => v.type === "tram").length}<br />
            SKM: {vehicles.filter(v => v.type === "skm").length}<br />
            SPECIAL: {vehicles.filter(v => v.isSpecial).length}<br />
            PREDICTED: {vehicles.filter(v => v.isPredicted).length}<br />
            Total: {vehicles.length}
        </DialogContent>
    </Dialog>;
};