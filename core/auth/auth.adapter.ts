import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { authFetcher, privateFetcher } from "../api/api.config";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  isChecked: boolean;
  birthDate: string;
  roleType: string;
};

type CompleteProfilePayload = {
  phone: number;
  roleType: string;
  birthDate: string;
};

export interface Role {
  _id: string;
  name: string;
  label?: string;
}

export const AuthAdapter = {
  login: async (payload: LoginPayload) => {
    const response = await authFetcher.instance.post("/auth/login-email", payload);
    const tokenPayload = response.data?.data || response.data;

    // Guardamos tokens si existen
    if (tokenPayload?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", tokenPayload.accessToken);
    }
    if (tokenPayload?.refreshToken) {
      await SecureStorageAdapter.setItem("refreshToken", tokenPayload.refreshToken);
    }

    return tokenPayload;
  },

  register: async (payload: RegisterPayload) => {
    const response = await authFetcher.instance.post("/auth/signup", payload);

    const tokenPayload = response.data?.data || response.data;

    if (tokenPayload?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", tokenPayload.accessToken);
    }

    if (tokenPayload?.refreshToken) {
      await SecureStorageAdapter.setItem("refreshToken", tokenPayload.refreshToken);
    }

    return tokenPayload;
  },

  logout: async () => {
    await SecureStorageAdapter.deleteItem("accessToken");
    await SecureStorageAdapter.deleteItem("refreshToken");
    return true;
  },

  refreshToken: async () => {
    const response = await privateFetcher.instance.post("/auth/check-status");

    if (response.data?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", response.data.accessToken);
    }

    return response.data;
  },

  completeProfile: async (payload: CompleteProfilePayload) => {
    const response = await privateFetcher.instance.put("/user/complete-profile", payload);
    return response.data;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await authFetcher.instance.get("/roles");
    return response.data?.data || response.data || [];
  },
};
