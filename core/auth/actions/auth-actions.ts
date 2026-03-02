import { AuthAdapter } from "@/core/auth/auth.adapter";

export interface AuthUser {
  email: string;
  accessToken: string;
  refreshToken: string;
}

const mapAuthResponse = (data: any): AuthUser => ({
  email: data.email,
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
});

export const authActions = {
  login: async (email: string, password: string): Promise<AuthUser | null> => {
    try {
      const data = await AuthAdapter.login({ email, password });
      return mapAuthResponse(data);
    } catch (error) {
      console.error("authLogin error :>> ", error);
      return null;
    }
  },

  checkStatus: async (): Promise<AuthUser | null> => {
    try {
      const data = await AuthAdapter.refreshToken();
      return data ? mapAuthResponse(data) : null;
    } catch (error) {
      console.error("authCheckStatus error :>> ", error);
      return null;
    }
  },

  logout: async () => {
    await AuthAdapter.logout();
  },

  signUp: async (params: any) => {
    try {
      const { role, ...restParams } = params;
      const data = await AuthAdapter.register({ ...restParams, roleType: role });
      return mapAuthResponse(data);
    } catch (error) {
      console.error("authLogin error :>> ", error);
      return null;
    }
  },
};
