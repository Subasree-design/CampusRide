import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  horizontal?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = true,
  className = '',
  horizontal = false,
}) => {
  const logoDimensions = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  const wordmarkSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div
      className={`flex ${
        horizontal ? 'flex-row items-center gap-3.5' : 'flex-col items-center text-center gap-2'
      } ${className}`}
    >
      {/* Official College Emblem Logo */}
      <div className="relative p-1 rounded-full bg-white shadow-xs border border-amber-200/60 shrink-0">
        <img
          src="/assets/kcg-college-bus-logo.png"
          alt="KCG College of Technology - Official College Bus Emblem"
          className={`${logoDimensions} object-contain rounded-full transition-transform hover:scale-105 duration-200`}
          onError={(e) => {
            // Fallback gracefully to high-res stylized SVG if image loading has issues
            const target = e.currentTarget;
            target.onerror = null;
            target.src = '/assets/kcg-college-bus-logo.png';
          }}
        />
      </div>

      {/* CampusRide Wordmark & College Attribution */}
      {showWordmark && (
        <div className={horizontal ? 'text-left' : 'text-center'}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-black tracking-tight text-slate-900 ${wordmarkSize}`}>
              Campus<span className="text-amber-500">Ride</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              KCG TECH
            </span>
          </div>

          <div className="text-[11px] font-semibold text-slate-500 leading-tight">
            KCG College of Technology, Chennai
          </div>

          {showTagline && (
            <div className="text-[11px] italic font-medium text-amber-700 mt-0.5">
              &ldquo;Your Journey. Our Responsibility.&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
};
