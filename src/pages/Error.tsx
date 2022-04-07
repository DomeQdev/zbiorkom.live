import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default ({ type, message }: {
    type: "info" | "success" | "warning" | "error",
    message: string
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        toast[type](message);
        navigate("/");
    }, []);

    return <>{message}</>;
};