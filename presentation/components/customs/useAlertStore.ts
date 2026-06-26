import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertConfig {
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelText?: string;
  onCancel?: () => void;
}

interface AlertState {
  visible: boolean;
  config: AlertConfig | null;
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  config: null,
  showAlert: (config) => set({ visible: true, config }),
  hideAlert: () => set({ visible: false, config: null }),
}));
