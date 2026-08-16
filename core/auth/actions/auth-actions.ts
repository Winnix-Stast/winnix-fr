import { AuthAdapter } from "@/core/auth/auth.adapter";

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  roles: string[];
  roleEntities: any[];
  isProfileComplete?: boolean;
  accessToken: string;
  refreshToken: string;
}

const mapAuthResponse = (data: any): AuthUser => ({
  id: data.id,
  email: data.email,
  username: data.username,
  nickname: data.nickname,
  avatar: data.avatar,
  roles: data.roles || [],
  roleEntities: data.roleEntities || [],
  isProfileComplete: data.isProfileComplete,
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
});

export const authActions = {
  login: async (email: string, password: string): Promise<AuthUser | null> => {
    try {
      const data = await AuthAdapter.login({ email, password });
      return mapAuthResponse(data);
    } catch (error) {
      console.log("authLogin error :>> ", error);
      return null;
    }
  },

  loginWithGoogle: async (idToken: string): Promise<AuthUser | null> => {
    try {
      const data = await AuthAdapter.loginWithGoogle(idToken);
      return mapAuthResponse(data);
    } catch (error) {
      console.log("loginWithGoogle error :>> ", error);
      return null;
    }
  },

  requestForgotPassword: async (email: string) => {
    try {
      return await AuthAdapter.requestForgotPassword(email);
    } catch (error) {
      console.log("requestForgotPassword error :>> ", error);
      throw error;
    }
  },

  verifyOtp: async (email: string, code: string) => {
    try {
      return await AuthAdapter.verifyOtp(email, code);
    } catch (error) {
      console.log("verifyOtp error :>> ", error);
      throw error;
    }
  },

  resetPassword: async (payload: { email: string; code: string; password: string; confirmPassword: string }) => {
    try {
      return await AuthAdapter.resetPassword(payload);
    } catch (error) {
      console.log("resetPassword error :>> ", error);
      throw error;
    }
  },

  completeProfile: async (payload: { phone: number; role: string; birthDate: string }) => {
    try {
      return await AuthAdapter.completeProfile(payload);
    } catch (error) {
      console.log("completeProfile error :>> ", error);
      throw error;
    }
  },

  checkStatus: async (): Promise<AuthUser | null> => {
    try {
      const data = await AuthAdapter.refreshToken();
      return data ? mapAuthResponse(data) : null;
    } catch (error) {
      console.log("authCheckStatus error :>> ", error);
      return null;
    }
  },

  logout: async () => {
    await AuthAdapter.logout();
  },

  signUp: async (params: any) => {
    try {
      const roleType = params.roleType || params.role;
      const data = await AuthAdapter.register({ ...params, roleType });
      return mapAuthResponse(data);
    } catch (error) {
      console.log("authSignUp error :>> ", error);
      return null;
    }
  },
};
