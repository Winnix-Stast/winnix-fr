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
  phone: number;
  birthDate: string;
  roleType: string;
};

type CompleteProfilePayload = {
  phone: number;
  role: string;
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

    if (tokenPayload?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", tokenPayload.accessToken);
    }
    if (tokenPayload?.refreshToken) {
      await SecureStorageAdapter.setItem("refreshToken", tokenPayload.refreshToken);
    }

    return tokenPayload;
  },

  loginWithGoogle: async (idToken: string) => {
    const response = await authFetcher.instance.post("/auth/google", { idToken });
    const tokenPayload = response.data?.data || response.data;

    if (tokenPayload?.accessToken) {
      await SecureStorageAdapter.setItem("accessToken", tokenPayload.accessToken);
    }
    if (tokenPayload?.refreshToken) {
      await SecureStorageAdapter.setItem("refreshToken", tokenPayload.refreshToken);
    }

    return tokenPayload;
  },

  requestForgotPassword: async (email: string) => {
    const response = await authFetcher.instance.post("/auth/forgot-password", { email });
    return response.data?.data || response.data;
  },

  verifyOtp: async (email: string, code: string) => {
    const response = await authFetcher.instance.post("/auth/verify-otp", { email, code });
    return response.data?.data || response.data;
  },

  resetPassword: async (payload: { email: string; code: string; password: string; confirmPassword: string }) => {
    const response = await authFetcher.instance.post("/auth/reset-password", payload);
    return response.data?.data || response.data;
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
    return response.data?.data || response.data;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await authFetcher.instance.get("/roles");
    return response.data?.data || response.data || [];
  },
};
