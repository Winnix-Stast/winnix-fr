import { create } from "zustand";

import { authActions } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  activeRole?: string;

  setActiveRole: (role: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (params: any) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  changeStatus: (accessToken?: string, refreshToken?: string, user?: User) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  //Properties
  status: "checking",
  token: undefined,
  user: undefined,
  activeRole: undefined,

  //Methods (Actions)
  setActiveRole: (role: string) => set({ activeRole: role }),
  changeStatus: async (accessToken?: string, refreshToken?: string, user?: User) => {
    if (!accessToken || !refreshToken || !user) {
      set({ status: "unauthenticated", accessToken: undefined, refreshToken: undefined, user: undefined, activeRole: undefined });
      await SecureStorageAdapter.deleteItem("accessToken");
      await SecureStorageAdapter.deleteItem("refreshToken");
      return false;
    }

    let initialRole = "player";
    if (user.roleEntities && user.roleEntities.length > 0) {
      const roleNames = user.roleEntities.map((r: any) => r.name);
      if (roleNames.includes("organizer")) initialRole = "organizer";
      else if (roleNames.includes("tournament manager")) initialRole = "tournament manager";
      else if (roleNames.includes("captain")) initialRole = "captain";
      else initialRole = roleNames[0];
    }

    set({ status: "authenticated", accessToken, refreshToken, user, activeRole: initialRole });
    await SecureStorageAdapter.setItem("accessToken", accessToken);
    await SecureStorageAdapter.setItem("refreshToken", refreshToken);

    return true;
  },

  login: async (email: string, password: string) => {
    const resp = await authActions.login(email, password);
    return get().changeStatus(resp?.accessToken, resp?.refreshToken, { id: resp?.id, email: resp?.email, roles: resp?.roles, roleEntities: resp?.roleEntities });
  },

  signup: async (params: any) => {
    const resp = await authActions.signUp(params);
    return get().changeStatus(resp?.accessToken, resp?.refreshToken, { id: resp?.id, email: resp?.email, roles: resp?.roles, roleEntities: resp?.roleEntities });
  },

  checkStatus: async () => {
    const resp = await authActions.checkStatus();
    if (!resp) {
      set({ status: "unauthenticated", accessToken: undefined, refreshToken: undefined, user: undefined, activeRole: undefined });
      return;
    }

    let initialRole = "player";
    if (resp.roleEntities && resp.roleEntities.length > 0) {
      const roleNames = resp.roleEntities.map((r: any) => r.name);
      if (roleNames.includes("organizer")) initialRole = "organizer";
      else if (roleNames.includes("tournament manager")) initialRole = "tournament manager";
      else if (roleNames.includes("captain")) initialRole = "captain";
      else initialRole = roleNames[0];
    }

    set({ status: "authenticated", accessToken: resp.accessToken, refreshToken: resp.refreshToken, user: { id: resp.id, email: resp.email, roles: resp.roles, roleEntities: resp.roleEntities }, activeRole: initialRole });
    return;
  },

  logout: async () => {
    await SecureStorageAdapter.deleteItem("accessToken");
    await SecureStorageAdapter.deleteItem("refreshToken");
    set({ status: "unauthenticated", accessToken: undefined, refreshToken: undefined, user: undefined, activeRole: undefined });
  },
}));
