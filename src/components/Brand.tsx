import { Leaf } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="brand">
    <span className="brand-mark"><Leaf size={19} strokeWidth={2.2} /></span>
    {!compact && <span className="brand-word">eco<span>coin</span></span>}
  </span>;
}
