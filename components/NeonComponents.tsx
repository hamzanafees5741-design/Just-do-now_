import React, { useRef, useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

// 3D Neon Input Field
interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeonInput: React.FC<NeonInputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-6 w-full">
    {label && (
      <label className="block text-gray-500 text-[10px] font-bold mb-2 uppercase tracking-[0.1em] font-mono flex items-center gap-2">
        <span className="text-cyan-500">></span>
        {label}
      </label>
    )}
    <div className="relative group">
      <input
        className={`relative w-full bg-[#0c0c0c] text-gray-200 border border-white/10 rounded-md py-3 px-4 leading-tight focus:outline-none focus:border-cyan-500/50 focus:bg-[#111] transition-all duration-200 font-mono text-sm ${className}`}
        {...props}
      />
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
       <label className="block text-gray-500 text-[10px] font-bold mb-2 uppercase tracking-[0.1em] font-mono flex items-center gap-2">
         {LabelIcon && <LabelIcon size={10} />}
         {label}
       </label>
       
       <button
         type="button"
         onClick={() => setIsOpen(!isOpen)}
         className={`w-full text-left bg-[#0c0c0c] border ${isOpen ? 'border-cyan-500/50' : 'border-white/10'} rounded-md py-3 px-4 text-gray-200 font-mono text-sm flex justify-between items-center transition-all duration-200`}
       >
          <span className="truncate">{selectedLabel}</span>
          <LucideIcons.ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
       </button>

       {/* Dropdown Menu */}
       <div className={`absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-md shadow-2xl overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors border-b border-white/5 last:border-0 hover:bg-white/5 flex items-center gap-2 ${value === opt.value ? 'text-cyan-400 bg-cyan-950/20' : 'text-gray-400'}`}
              >
                {value === opt.value && <span className="text-cyan-400">></span>}
                {opt.label}
              </button>
            ))}
         </div>
    </div>
  );
}

// Minimal Button
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const NeonButton: React.FC<NeonButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  let variantStyle = "";
  if (variant === 'primary') {
    variantStyle = "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_2px_10px_rgba(8,145,178,0.3)]";
  } else if (variant === 'secondary') {
    variantStyle = "bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 border border-white/10";
  } else if (variant === 'danger') {
    variantStyle = "bg-red-900/50 hover:bg-red-900/80 text-red-200 border border-red-800/50";
  }

  return (
    <button className={`relative px-4 py-3 font-mono font-bold text-xs rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Console Log Style Row (Replaces NeonCard for list items)
export const ConsoleRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#0a0a0a] border border-white/10 rounded-lg hover:bg-[#111] hover:border-white/20 transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

// 3D Card kept for Stats/Dashboard
export const NeonCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; noTilt?: boolean }> = ({ children, className = '', onClick, noTilt = false }) => {
    return (
      <div 
        onClick={onClick}
        className={`bg-[#0c0c0c] border border-white/10 rounded-xl p-5 relative overflow-hidden ${className}`}
      >
        {children}
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
        className="w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
      />
      <div className="flex justify-between mt-2 text-[9px] font-mono text-gray-500">
        <span>0%</span>
        <span>100%</span>
      </div>
      <div className="text-center font-bold text-cyan-400 font-mono text-sm mt-1">
        EFFICIENCY: {value}%
      </div>
    </div>
  );
};

// Blue Check Button (Matches Screenshot)
export const NeonChargeButton: React.FC<{ onComplete: () => void, completed: boolean, className?: string }> = ({ onComplete, completed, className = '' }) => {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onComplete(); }}
      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${className} 
      ${completed 
        ? 'bg-[#0070f3] text-white shadow-[0_0_15px_rgba(0,112,243,0.4)] scale-100' // Vercel Blue
        : 'bg-transparent border-2 border-gray-700 text-transparent hover:border-gray-500 hover:bg-white/5'}`}
    >
      {completed && <LucideIcons.Check size={16} strokeWidth={4} />}
    </button>
  );
};

// Icon Selector
export const NeonIconSelect: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const icons = ['Activity', 'Book', 'Dumbbell', 'Code', 'Droplets', 'Moon', 'Sun', 'Music', 'Briefcase', 'Heart', 'Zap', 'Coffee', 'CheckCircle', 'Star', 'Anchor', 'Feather', 'Cpu', 'Terminal', 'Globe', 'Shield'];
  
  return (
    <div className="grid grid-cols-5 gap-2 mb-6">
      {icons.map((iconName) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName];
        const isSelected = selected === iconName;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onSelect(iconName)}
            className={`aspect-square rounded-md flex items-center justify-center transition-all duration-200 ${
              isSelected 
                ? 'bg-cyan-600 text-white shadow-lg' 
                : 'bg-[#111] border border-white/5 text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
            }`}
          >
            {Icon && <Icon size={18} />}
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
    <div className="flex justify-between gap-1 mb-6 bg-[#0a0a0a] p-1 rounded-lg border border-white/10">
      {days.map((day, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <button
            key={index}
            type="button"
            onClick={() => toggleDay(index)}
            className={`w-9 h-9 rounded-md text-[10px] font-bold font-mono transition-all duration-200 ${
              isSelected
                ? 'bg-cyan-600 text-white'
                : 'bg-transparent text-gray-600 hover:text-gray-400'
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
  <div className="flex bg-[#0a0a0a] border border-white/10 rounded-lg p-1 relative w-full mb-6">
    <div 
      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#222] border border-white/10 rounded-md transition-all duration-300 ${value ? 'left-[calc(50%+2px)]' : 'left-1'}`}
    ></div>
    <button 
      onClick={() => onChange(false)}
      className={`flex-1 relative z-10 py-2 text-[10px] font-bold font-mono uppercase tracking-widest text-center transition-colors ${!value ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
    >
      {leftLabel}
    </button>
    <button 
      onClick={() => onChange(true)}
      className={`flex-1 relative z-10 py-2 text-[10px] font-bold font-mono uppercase tracking-widest text-center transition-colors ${value ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
    >
      {rightLabel}
    </button>
  </div>
);

// Minimal Progress Bar
export const NeonProgress: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-[#111] rounded-full h-2 overflow-hidden">
      <div 
        className="bg-cyan-500 h-full rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};