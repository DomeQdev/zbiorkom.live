import { create } from "zustand";

interface FollowState {
    isFollowing: boolean;
    setIsFollowing: (isFollowing: boolean) => void;
    reset: () => void;
}

export const useFollowStore = create<FollowState>((set) => ({
    isFollowing: true,
    setIsFollowing: (isFollowing) => set({ isFollowing }),
    reset: () => set({ isFollowing: true }),
}));
