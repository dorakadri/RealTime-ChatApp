import { create } from "zustand";
import { User } from "../gql/graphql";
import { persist } from "zustand/middleware";

interface UserState {
  id: number | undefined;
  avatarUrl: string | null;
  fullname: string;
  email?: string;
  updateProfileImage: (image: string) => void;
  updateUsername: (name: string) => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: undefined,
      fullname: "",
      email: "",
      avatarUrl: null,
      updateProfileImage: (image: string) => set({ avatarUrl: image }),
      updateUsername: (name: string) => set({ fullname: name }),
      setUser: (user) =>
        set({
          id: user.id || undefined,
          fullname: user.fullname,
          email: user.email,
          avatarUrl: user.avatarUrl,
        }),
    }),
    { name: "user-storage" }
  )
);
