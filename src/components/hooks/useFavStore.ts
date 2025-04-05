import { FavoriteStop } from "typings";
import { create } from "zustand";

interface FavState {
    favorites: FavoriteStop[];
    addFavoriteDirection: (
        id: string,
        location: [number, number],
        isStation: boolean,
        direction: [string, string]
    ) => void;
    removeFavoriteDirection: (id: string, directionIndex: number) => void;
    removeFavoriteStop: (id: string) => void;
    reset: () => void;
}

const key = `${window.location.pathname.split("/")[1]}.favs`;

export default create<FavState>()((set) => ({
    favorites: JSON.parse(localStorage.getItem(key) || "[]"),
    addFavoriteDirection: (id, location, isStation, direction) => {
        set((state) => {
            const favorite = state.favorites.find((fav) => fav.id === id);

            if (favorite) {
                const directions = [...favorite.directions, direction];
                const favorites = state.favorites.map((fav) =>
                    fav.id === id ? { ...fav, directions } : fav
                );
                localStorage.setItem(key, JSON.stringify(favorites));

                return { favorites };
            } else {
                const favorites = [...state.favorites, { id, location, directions: [direction], isStation }];
                localStorage.setItem(key, JSON.stringify(favorites));

                return { favorites };
            }
        });
    },
    removeFavoriteDirection: (id, directionIndex) => {
        set((state) => {
            const favorite = state.favorites.find((fav) => fav.id === id);
            if (!favorite) return { favorites: state.favorites };

            const directions = favorite.directions.filter((_, index) => index !== directionIndex);
            const removeStop = directions.length === 0;

            const favorites = removeStop
                ? state.favorites.filter((fav) => fav.id !== id)
                : state.favorites.map((fav) => (fav.id === id ? { ...fav, directions } : fav));

            localStorage.setItem(key, JSON.stringify(favorites));

            return { favorites };
        });
    },
    removeFavoriteStop: (id) => {
        set((state) => {
            const favorites = state.favorites.filter((fav) => fav.id !== id);
            localStorage.setItem(key, JSON.stringify(favorites));

            return { favorites };
        });
    },
    reset: () => {
        localStorage.removeItem(key);
        set({ favorites: [] });
    },
}));
