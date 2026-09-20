import { BackendError, BackendErrorKind, loadCities } from "cities";
import { create } from "zustand";

type BackendState = {
    status: "loading" | "ready" | "error";
    errorKind: BackendErrorKind;
    // bumped after every successful load — remounts the router so the freshly loaded cities are used
    version: number;
    load: () => Promise<void>;
};

const useBackendStore = create<BackendState>((set, get) => ({
    status: "loading",
    errorKind: "unknown",
    version: 0,

    load: async () => {
        set({ status: "loading" });

        try {
            await loadCities();

            set({ status: "ready", version: get().version + 1 });
        } catch (error) {
            set({
                status: "error",
                errorKind: error instanceof BackendError ? error.kind : "unknown",
            });
        }
    },
}));

export default useBackendStore;
