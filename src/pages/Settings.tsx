import { Close, NavigateNext } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ToggleButton, Chip, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default () => {
    const navigate = useNavigate();

    return <Dialog
        open
        onClose={() => navigate("/")}
        scroll="paper"
        fullScreen
    >
        <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Ustawienia</span><IconButton onClick={() => navigate("/")}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
            soon™
        </DialogContent>
        <DialogActions>
            soon™
        </DialogActions>
    </Dialog>;
};