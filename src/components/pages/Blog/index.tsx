import { Outlet } from "react-router-dom";
import { Dialog } from "@mui/material";
import { memo } from "react";

import "./blog.css";

export default memo(() => {
    return (
        <Dialog
            open
            fullScreen
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: "#141314",
                    color: "#fff",
                },
            }}
        >
            <Outlet />
        </Dialog>
    );
});
