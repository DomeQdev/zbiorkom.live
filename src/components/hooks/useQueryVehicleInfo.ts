import { getFromAPI } from "@/util/fetchFunctions";
import { useQuery } from "@tanstack/react-query";
import { VehicleInfo } from "typings";

export default ({ city, vehicle }: { city?: string; vehicle?: string }) => {
    return useQuery({
        queryKey: ["vehicleInfo", city, vehicle],
        queryFn: async ({ signal }) => {
            if (!city || !vehicle) return;

            return getFromAPI<VehicleInfo>(city, "vehicles/getVehicle", { id: vehicle }, signal);
        },
        enabled: !!city && !!vehicle,
    });
};
