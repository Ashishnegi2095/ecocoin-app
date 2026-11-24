import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

type ToastMessage = { id: number; text: string };
const ToastContext = createContext<(text: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const notify = useCallback((text: string) => {
    const id = Date.now();
    setMessages(current => [...current, { id, text }]);
    window.setTimeout(() => setMessages(current => current.filter(message => message.id !== id)), 3600);
  }, []);
  return <ToastContext.Provider value={notify}>
    {children}
    <div className="toast-stack" aria-live="polite">
      <AnimatePresence>{messages.map(message => <motion.div key={message.id} className="toast" initial={{ opacity: 0, y: 12, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 20 }}>
        <CheckCircle2 size={19} />{message.text}<button onClick={() => setMessages(current => current.filter(item => item.id !== message.id))} aria-label="Dismiss notification"><X size={15} /></button>
      </motion.div>)}</AnimatePresence>
    </div>
  </ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);
