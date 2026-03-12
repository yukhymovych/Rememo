/**
 * Minimal toast: call showToast(msg) from anywhere. Toaster component must be mounted.
 */
export interface ToastAction {
  label: string;
  onClick: () => void;
  showCountdown?: boolean;
}

export interface ToastPayload {
  message: string;
  durationMs?: number;
  action?: ToastAction;
}

type Listener = (toast: ToastPayload) => void;
const listeners: Listener[] = [];

export function showToast(messageOrToast: string | ToastPayload): void {
  const toast: ToastPayload =
    typeof messageOrToast === 'string'
      ? { message: messageOrToast }
      : messageOrToast;
  listeners.forEach((listener) => listener(toast));
}

export function addToastListener(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i >= 0) listeners.splice(i, 1);
  };
}
