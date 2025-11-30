import { useQuery } from "@tanstack/react-query";
import { getFromAPI } from "@/util/fetchFunctions";
import { VehicleInfo } from "typings";
import { create } from "zustand";

// Store do globalnego przechowywania świątecznych pojazdów
interface ChristmasStore {
    vehicleIds: Set<string>;
    setVehicleIds: (ids: string[]) => void;
    isChristmasVehicle: (id: string) => boolean;
}

export const useChristmasStore = create<ChristmasStore>((set, get) => ({
    vehicleIds: new Set(),
    setVehicleIds: (ids) => set({ vehicleIds: new Set(ids) }),
    isChristmasVehicle: (id) => get().vehicleIds.has(id),
}));

export type ChristmasVehicle = VehicleInfo;

export const useQueryChristmasVehicles = (city: string) => {
    const setVehicleIds = useChristmasStore((state) => state.setVehicleIds);

    return useQuery({
        queryKey: ["christmasVehicles", city],
        queryFn: async ({ signal }) => {
            const response = await getFromAPI<ChristmasVehicle[]>(
                city,
                "vehicles/getChristmasVehicles",
                {},
                signal,
            );

            // Ustaw ID pojazdów świątecznych w store
            const ids = response.map((v) => v[0]);
            setVehicleIds(ids);

            return response;
        },
        staleTime: 1000 * 60 * 30, // 30 minut
        refetchOnWindowFocus: false,
    });
};
