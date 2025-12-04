import React, { useRef, useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

// 3D Neon Input Field
interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeonInput: React.FC<NeonInputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-6 w-full">
    {label && (
      <label className="block text-cyan-400 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] font-display flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-cyan-400 rotate-45 shadow-[0_0_8px_#00f3ff]"></span>
        {label}
      </label>
    )}
    <div className="relative group perspective-500">
      {/* Background Glow on Focus */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-70 blur-sm transition duration-500"></div>
      
      {/* Inner Metallic Look */}
      <input
        className={`relative w-full bg-[#080808] text-cyan-50 border border-white/10 rounded-xl py-4 px-5 leading-tight focus:outline-none focus:border-cyan-400/50 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] placeholder-cyan-900/30 transition-all duration-300 font-mono text-sm tracking-wide ${className}`}
        style={{ backgroundImage: 'linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)' }}
        {...props}
      />
      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50 rounded-br-xl pointer-events-none"></div>
    </div>
  </div>
);

// Custom Neon Select Dropdown
export const NeonSelect: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  icon?: any;
}> = ({ label, value, onChange, options, icon: LabelIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative w-full mb-0" ref={dropdownRef}>
       <label className="block text-cyan-400 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] font-display flex items-center gap-2">
         {LabelIcon && <LabelIcon size={10} />}
         {label}
       </label>
       
       <button
         type="button"
         onClick={() => setIsOpen(!isOpen)}
         className={`w-full text-left bg-[#080808] border ${isOpen ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/10'} rounded-xl py-4 px-4 text-cyan-50 font-mono text-xs uppercase tracking-wider flex justify-between items-center transition-all duration-300 relative overflow-visible group`}
       >
          <span className="relative z-10 truncate">{selectedLabel}</span>
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-gray-600'}`}>
            <LucideIcons.ChevronDown size={14} />
          </div>
          
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
       </button>

       {/* Dropdown Menu */}
       <div className={`absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-cyan-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-xl transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-mono uppercase tracking-wider transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-cyan-500/10 hover:text-cyan-400 hover:pl-6 flex items-center gap-2 ${value === opt.value ? 'bg-cyan-900/20 text-cyan-400 pl-6' : 'text-gray-400'}`}
              >
                {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></div>}
                {opt.label}
              </button>
            ))}
         </div>
    </div>
  );
}

// 3D Physical Button
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const NeonButton: React.FC<NeonButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "relative px-6 py-4 font-bold text-xs uppercase tracking-[0.15em] rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:translate-y-1 active:shadow-none group overflow-hidden flex items-center justify-center gap-2 font-display";
  
  let variantStyle = "";
  if (variant === 'primary') {
    variantStyle = `
      text-black 
      bg-gradient-to-b from-cyan-300 to-cyan-500 
      border-b-4 border-cyan-700 
      shadow-[0_0_25px_rgba(0,243,255,0.4)]
      hover:brightness-110 hover:shadow-[0_0_40px_rgba(0,243,255,0.6)]
    `;
  } else if (variant === 'secondary') {
    variantStyle = `
      text-cyan-400 
      bg-[#0a0a0a] 
      border border-cyan-500/30 
      border-b-4 border-cyan-900/50
      hover:border-cyan-400 hover:text-cyan-200
      hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]
    `;
  } else if (variant === 'danger') {
    variantStyle = `
      text-red-100 
      bg-gradient-to-b from-red-600 to-red-800
      border-b-4 border-red-900 
      shadow-[0_0_20px_rgba(239,68,68,0.4)]
      hover:brightness-110
      hover:shadow-[0_0_35px_rgba(239,68,68,0.6)]
    `;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2 drop-shadow-md">{children}</span>
    </button>
  );
};

// Holographic 3D Tilt Card (Mouse-tracking Parallax)
export const NeonCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; noTilt?: boolean }> = ({ children, className = '', onClick, noTilt = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (noTilt || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (noTilt || !cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`holo-card-pro rounded-2xl p-6 ${className}`}
    >
      <div className="holo-shine"></div>
      
      {/* Decorative Tech Lines */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-2 left-2 w-8 h-[1px] bg-cyan-500/30 z-10"></div>
      
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

// New Efficiency Slider Component
export const NeonSlider: React.FC<{ value: number; onChange: (val: number) => void }> = ({ value, onChange }) => {
  return (
    <div className="w-full relative py-4 group">
      <input
        type="range"
        min="0"
        max="100"
        step="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 relative z-20"
      />
      
      {/* Visual Track */}
      <div className="absolute top-[18px] left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded opacity-50 pointer-events-none"></div>
      
      <div className="flex justify-between mt-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
        <span>Low Power</span>
        <span>Optimal</span>
      </div>
      
      {/* Current Value Tooltip */}
      <div className="text-center font-bold text-cyan-400 font-display text-xl mt-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        {value}%
      </div>
    </div>
  );
};

// Tactical Charge Button (Hold to Complete)
export const NeonChargeButton: React.FC<{ onComplete: () => void, completed: boolean, className?: string }> = ({ onComplete, completed, className = '' }) => {
  const [charging, setCharging] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (charging && !completed) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            onComplete();
            return 100;
          }
          return prev + 5; // Faster charge
        });
      }, 16); 
    } else {
      clearInterval(intervalRef.current);
      if (!completed) setProgress(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [charging, completed, onComplete]);

  const handleStart = (e: any) => {
    e.stopPropagation(); 
    if (completed) {
      // CHANGED: Do nothing if already completed. This prevents accidental untoggling.
      return;
    } else {
      setCharging(true);
    }
  };

  const handleEnd = (e: any) => {
    e.stopPropagation();
    setCharging(false);
    if (progress < 100 && !completed) setProgress(0);
  };

  return (
    <button
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      className={`relative w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 border-2 ${className} 
      ${completed 
        ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_30px_rgba(0,243,255,0.6)] cursor-default' 
        : 'bg-[#050505] border-white/10 hover:border-cyan-500/50 cursor-pointer'}`}
    >
      {/* Charge Effect */}
      {!completed && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-cyan-400 transition-all duration-0 ease-linear shadow-[0_0_20px_rgba(0,243,255,0.8)]"
          style={{ height: `${progress}%` }}
        />
      )}
      
      {/* Icon */}
      <div className="relative z-10 pointer-events-none">
        {completed ? (
          <LucideIcons.Check size={24} className="text-black stroke-[4]" />
        ) : (
          <div className={`transition-all duration-200 ${charging ? 'scale-90 text-black mix-blend-screen' : 'text-gray-600'}`}>
            <LucideIcons.Fingerprint size={28} />
          </div>
        )}
      </div>
    </button>
  );
};

// 3D Jewel Icon
export const StructuredIcon: React.FC<{ icon: string, size?: number, className?: string }> = ({ icon, size = 24, className = '' }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[icon] || LucideIcons.Activity;
  
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-white/5 shadow-[5px_5px_10px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.05)] ${className}`} style={{ width: size * 2.2, height: size * 2.2 }}>
      {/* Internal Glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50"></div>
      
      <IconComponent size={size} className="text-cyan-400 relative z-10 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
    </div>
  );
}

// Icon Selector
export const NeonIconSelect: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const icons = ['Activity', 'Book', 'Dumbbell', 'Code', 'Droplets', 'Moon', 'Sun', 'Music', 'Briefcase', 'Heart', 'Zap', 'Coffee', 'CheckCircle', 'Star', 'Anchor', 'Feather', 'Cpu', 'Terminal', 'Globe', 'Shield'];
  
  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {icons.map((iconName) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName];
        const isSelected = selected === iconName;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onSelect(iconName)}
            className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group ${
              isSelected 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,243,255,0.6)] scale-110 z-10 border-2 border-white' 
                : 'bg-[#111] border border-white/5 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-[#1a1a1a] hover:scale-105 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]'
            }`}
          >
            {Icon && <Icon size={20} className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />}
          </button>
        );
      })}
    </div>
  );
};

// Day Picker
export const NeonDayPicker: React.FC<{ selectedDays: number[]; onChange: (days: number[]) => void }> = ({ selectedDays, onChange }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      if (selectedDays.length > 1) { 
        onChange(selectedDays.filter(d => d !== index));
      }
    } else {
      onChange([...selectedDays, index].sort());
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-6 bg-black/40 p-2 rounded-xl border border-white/10 shadow-inner">
      {days.map((day, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <button
            key={index}
            type="button"
            onClick={() => toggleDay(index)}
            className={`w-10 h-10 rounded-lg text-xs font-bold font-display transition-all duration-300 ${
              isSelected
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,243,255,0.5)] scale-105'
                : 'bg-transparent text-gray-600 hover:text-cyan-300'
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

// Toggle Switch
export const NeonToggle: React.FC<{ value: boolean; onChange: (val: boolean) => void; leftLabel: string; rightLabel: string }> = ({ value, onChange, leftLabel, rightLabel }) => (
  <div className="flex bg-[#050505] border border-white/10 rounded-xl p-1 relative w-full mb-8 shadow-[inset_0_2px_10px_rgba(0,0,0,1)]">
    <div 
      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-cyan-900/30 border border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.15)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${value ? 'left-[calc(50%+2px)]' : 'left-1'}`}
    >
      <div className="absolute inset-0 bg-cyan-400/10 rounded-lg animate-pulse"></div>
    </div>
    <button 
      onClick={() => onChange(false)}
      className={`flex-1 relative z-10 py-3 text-[10px] font-bold font-display uppercase tracking-widest text-center transition-colors duration-300 ${!value ? 'text-cyan-400 text-shadow-glow' : 'text-gray-600 hover:text-gray-400'}`}
    >
      {leftLabel}
    </button>
    <button 
      onClick={() => onChange(true)}
      className={`flex-1 relative z-10 py-3 text-[10px] font-bold font-display uppercase tracking-widest text-center transition-colors duration-300 ${value ? 'text-cyan-400 text-shadow-glow' : 'text-gray-600 hover:text-gray-400'}`}
    >
      {rightLabel}
    </button>
  </div>
);

// Progress Bar
export const NeonProgress: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-[#050505] border border-white/10 rounded-sm h-4 overflow-hidden p-[2px] shadow-[inset_0_1px_5px_rgba(0,0,0,1)]">
      <div 
        className="bg-gradient-to-r from-cyan-800 to-cyan-400 h-full rounded-sm shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-700 ease-out relative" 
        style={{ width: `${percentage}%` }}
      >
        {/* Striped pattern overlay */}
        <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(45deg,rgba(0,0,0,0.2) 25%,transparent 25%,transparent 50%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.2) 75%,transparent 75%,transparent)', backgroundSize: '10px 10px'}}></div>
      </div>
    </div>
  );
};