import { fetchWithAuth } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { VehicleInfo } from "typings";

type Props = {
    city: string;
    vehicle: string;
};

const fixId = (city: string, vehicle: string) => {
    if (vehicle.startsWith("11/")) {
        return vehicle.replace("11/", "3/");
    }

    return vehicle;
};

const fetchData = (city: Props["city"], vehicle: Props["vehicle"], signal: AbortSignal) => {
    const id = fixId(city, vehicle);

    return fetchWithAuth<VehicleInfo>(
        `${Gay.base}/${city}/vehicles/getVehicle?id=${encodeURIComponent(id)}`,
        signal
    );
};

export default (props: Props) => {
    return useQuery({
        queryKey: ["vehicleInfo", props.city, props.vehicle],
        queryFn: ({ signal }) => fetchData(props.city, props.vehicle, signal),
    });
};
