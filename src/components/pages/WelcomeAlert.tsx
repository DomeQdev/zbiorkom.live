import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Alert = {
    title: string;
    body: string;
    closeable: boolean;
    published: number;
};

export default () => {
    const [alert, setAlert] = useState<Alert | null>(null);
    const { city } = useParams();

    useEffect(() => {
        const lastSeenAlert = JSON.parse(localStorage.getItem("lastSeenAlert") || "0");

        fetch(`https://re61.2137.workers.dev/${city}`)
            .then((res) => res.json() as Promise<Alert | null>)
            .then((res) => {
                if (!res || (res.closeable && res.published <= lastSeenAlert)) return;

                setAlert(res);
                localStorage.setItem("lastSeenAlert", res.published.toString());
            });
    }, []);

    if (!alert) return null;

    return (
        <Dialog open fullWidth onClose={alert.closeable ? () => setAlert(null) : undefined}>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: 3,
                }}
            >
                {alert.title}
                {alert.closeable && (
                    <IconButton onClick={() => setAlert(null)}>
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent dangerouslySetInnerHTML={{ __html: alert.body }} />
        </Dialog>
    );
};
