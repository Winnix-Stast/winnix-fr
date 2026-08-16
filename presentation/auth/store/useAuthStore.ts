import { create } from 'zustand';
import { authActions } from '@/core/auth/actions/auth-actions';
import { User } from '@/core/auth/interface/user';
import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  activeRole?: string;
  isProfileComplete?: boolean;

  setActiveRole: (role: string) => void;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; isProfileComplete?: boolean }>;
  loginWithGoogle: (
    idToken: string,
  ) => Promise<{ success: boolean; isProfileComplete?: boolean }>;
  signup: (params: any) => Promise<{ success: boolean; isProfileComplete?: boolean }>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  changeStatus: (
    accessToken?: string,
    refreshToken?: string,
    user?: User,
    isProfileComplete?: boolean,
  ) => Promise<{ success: boolean; isProfileComplete?: boolean }>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  //Properties
  status: 'checking',
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
  activeRole: undefined,
  isProfileComplete: true,

  //Methods (Actions)
  setActiveRole: (role: string) => set({ activeRole: role }),

  changeStatus: async (
    accessToken?: string,
    refreshToken?: string,
    user?: User,
    isProfileComplete: boolean = true,
  ) => {
    if (!accessToken || !refreshToken || !user) {
      set({
        status: 'unauthenticated',
        accessToken: undefined,
        refreshToken: undefined,
        user: undefined,
        activeRole: undefined,
        isProfileComplete: false,
      });
      await SecureStorageAdapter.deleteItem('accessToken');
      await SecureStorageAdapter.deleteItem('refreshToken');
      return { success: false };
    }

    let initialRole = 'player';
    if (user.roleEntities && user.roleEntities.length > 0) {
      const roleNames = user.roleEntities.map((r: any) => r.name);
      if (roleNames.includes('organizer')) initialRole = 'organizer';
      else if (roleNames.includes('tournament manager'))
        initialRole = 'tournament manager';
      else if (roleNames.includes('captain')) initialRole = 'captain';
      else initialRole = roleNames[0];
    }

    set({
      status: 'authenticated',
      accessToken,
      refreshToken,
      user,
      activeRole: initialRole,
      isProfileComplete,
    });
    await SecureStorageAdapter.setItem('accessToken', accessToken);
    await SecureStorageAdapter.setItem('refreshToken', refreshToken);

    return { success: true, isProfileComplete };
  },

  login: async (email: string, password: string) => {
    const resp = await authActions.login(email, password);
    if (!resp) return { success: false };
    return get().changeStatus(
      resp.accessToken,
      resp.refreshToken,
      {
        id: resp.id,
        email: resp.email,
        username: resp.username,
        nickname: resp.nickname,
        avatar: resp.avatar,
        roles: resp.roles,
        roleEntities: resp.roleEntities,
      },
      resp.isProfileComplete ?? true,
    );
  },

  loginWithGoogle: async (idToken: string) => {
    const resp = await authActions.loginWithGoogle(idToken);
    if (!resp) return { success: false };
    return get().changeStatus(
      resp.accessToken,
      resp.refreshToken,
      {
        id: resp.id,
        email: resp.email,
        username: resp.username,
        nickname: resp.nickname,
        avatar: resp.avatar,
        roles: resp.roles,
        roleEntities: resp.roleEntities,
      },
      resp.isProfileComplete ?? false,
    );
  },

  signup: async (params: any) => {
    const resp = await authActions.signUp(params);
    if (!resp) return { success: false };
    return get().changeStatus(
      resp.accessToken,
      resp.refreshToken,
      {
        id: resp.id,
        email: resp.email,
        username: resp.username,
        nickname: resp.nickname,
        avatar: resp.avatar,
        roles: resp.roles,
        roleEntities: resp.roleEntities,
      },
      true,
    );
  },

  checkStatus: async () => {
    const resp = await authActions.checkStatus();
    if (!resp) {
      set({
        status: 'unauthenticated',
        accessToken: undefined,
        refreshToken: undefined,
        user: undefined,
        activeRole: undefined,
        isProfileComplete: false,
      });
      return;
    }

    let initialRole = 'player';
    if (resp.roleEntities && resp.roleEntities.length > 0) {
      const roleNames = resp.roleEntities.map((r: any) => r.name);
      if (roleNames.includes('organizer')) initialRole = 'organizer';
      else if (roleNames.includes('tournament manager'))
        initialRole = 'tournament manager';
      else if (roleNames.includes('captain')) initialRole = 'captain';
      else initialRole = roleNames[0];
    }

    set({
      status: 'authenticated',
      accessToken: resp.accessToken,
      refreshToken: resp.refreshToken,
      user: {
        id: resp.id,
        email: resp.email,
        username: resp.username,
        nickname: resp.nickname,
        avatar: resp.avatar,
        roles: resp.roles,
        roleEntities: resp.roleEntities,
      },
      activeRole: initialRole,
      isProfileComplete: resp.isProfileComplete ?? true,
    });
  },

  logout: async () => {
    await SecureStorageAdapter.deleteItem('accessToken');
    await SecureStorageAdapter.deleteItem('refreshToken');
    set({
      status: 'unauthenticated',
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
      activeRole: undefined,
      isProfileComplete: false,
    });
  },
}));
