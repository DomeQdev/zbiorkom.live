import { Outlet } from "react-router-dom";
import { Dialog } from "@mui/material";
import { memo } from "react";
import useGoBack from "@/hooks/useGoBack";

import "./brigades.css";

export default memo(() => {
    const goBack = useGoBack();

    return (
        <Dialog fullWidth fullScreen={window.innerWidth <= 600} open onClose={() => goBack()}>
            <Outlet />
        </Dialog>
    );
});
