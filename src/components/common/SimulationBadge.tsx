import React from 'react';
import { Radio } from 'lucide-react';

interface SimulationBadgeProps {
  className?: string;
  pulsing?: boolean;
}

export const SimulationBadge: React.FC<SimulationBadgeProps> = ({
  className = '',
  pulsing = true,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulsing && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <Radio className="w-3 h-3 text-amber-600" />
      <span>SIMULATED GPS &amp; PROTOTYPE DATA</span>
    </div>
  );
};
