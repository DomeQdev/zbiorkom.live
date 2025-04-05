import { CircularProgress } from "@mui/material";

export default ({ height }: { height: string | number }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height,
        }}
    >
        <CircularProgress />
    </div>
);
