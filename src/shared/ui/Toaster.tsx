import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { addToastListener, type ToastPayload } from '../lib/toast';
import './Toaster.css';

const DURATION_MS = 4000;

export function Toaster() {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiresAtRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (tickerRef.current) clearInterval(tickerRef.current);
      timeoutRef.current = null;
      tickerRef.current = null;
      expiresAtRef.current = null;
    };

    const cleanup = addToastListener((incomingToast) => {
      clearTimers();
      const duration = incomingToast.durationMs ?? DURATION_MS;
      const expiresAt = Date.now() + duration;
      expiresAtRef.current = expiresAt;
      setRemainingMs(duration);
      setToast(incomingToast);

      tickerRef.current = setInterval(() => {
        const target = expiresAtRef.current;
        if (!target) return;
        const nextRemaining = Math.max(0, target - Date.now());
        setRemainingMs(nextRemaining);
      }, 250);

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        setRemainingMs(0);
        clearTimers();
      }, duration);
    });
    return () => {
      cleanup();
      clearTimers();
    };
  }, []);

  if (!toast) return null;

  const countdownSeconds = Math.ceil(remainingMs / 1000);

  const toastEl = (
    <div className="app-toast" role="status" aria-live="polite">
      <span className="app-toast__message">{toast.message}</span>
      {toast.action ? (
        <button
          type="button"
          className="app-toast__action"
          onClick={() => {
            toast.action?.onClick();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (tickerRef.current) clearInterval(tickerRef.current);
            timeoutRef.current = null;
            tickerRef.current = null;
            expiresAtRef.current = null;
            setToast(null);
            setRemainingMs(0);
          }}
        >
          {toast.action.showCountdown
            ? `${toast.action.label} (${countdownSeconds}s)`
            : toast.action.label}
        </button>
      ) : null}
    </div>
  );

  return createPortal(toastEl, document.body);
}
