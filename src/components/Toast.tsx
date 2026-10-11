import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastMessage: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white shadow-2xl backdrop-blur-md animate-slideUp">
      <div className="flex items-center gap-2.5 min-w-0">
        {toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        ) : (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span className="text-xs font-medium text-slate-200 truncate">{toast.message}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
