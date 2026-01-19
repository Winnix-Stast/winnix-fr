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
};

type CompleteProfilePayload = {
  phone: number;
  roleId: string;
};

export interface Role {
  _id: string;
  name: string;
  label?: string;
}

export const AuthAdapter = {
  login: async (payload: LoginPayload) => {
    console.log("payload :>> ", payload);
    const response = await authFetcher.instance.post("/auth/login-email", payload);
    console.log("response :>> ", response);

    // Guardamos tokens si existen
    if (response.data?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStorageAdapter.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await authFetcher.instance.post("/auth/signup", payload);

    if (response.data?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", response.data.accessToken);
    }

    if (response.data?.refreshToken) {
      await SecureStorageAdapter.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
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
