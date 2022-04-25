import { useEffect } from "react";
import { toast } from "react-toastify";

export default ({ type, message }: {
    type: "info" | "success" | "warning" | "error",
    message: string
}) => {
    useEffect(() => {
        toast[type](message);
    }, []);

    return <>{message}</>;
};