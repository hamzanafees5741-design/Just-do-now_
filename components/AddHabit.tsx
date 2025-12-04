import React, { useState, useEffect } from 'react';
import { Frequency, Habit } from '../types';
import { NeonInput, NeonButton, NeonCard, NeonIconSelect, NeonDayPicker, NeonSelect } from './NeonComponents';
import { ArrowLeft, Clock, Hourglass, Tag, Repeat, Heart, Briefcase, Cpu, Zap, Activity } from 'lucide-react';

interface AddHabitProps {
  onSave: (title: string, frequency: Frequency, days: number[], time: string, duration: number, category: string, icon: string) => void;
  onCancel: () => void;
  initialData?: Habit | null;
}

// Standard English Categories
const CATEGORIES = ['Health', 'Work', 'Skill', 'Mindset', 'Routine'];

const CATEGORY_ICONS: Record<string, any> = {
  Health: Heart,
  Work: Briefcase,
  Skill: Cpu,
  Mindset: Zap,
  Routine: Repeat
};

const AddHabit: React.FC<AddHabitProps> = ({ onSave, onCancel, initialData }) => {
  const getNextHour = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    const h = d.getHours().toString().padStart(2, '0');
    return `${h}:00`;
  };

  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<Frequency>(Frequency.DAILY);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [time, setTime] = useState(getNextHour());
  const [duration, setDuration] = useState<number>(30); // Default 30 mins
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [icon, setIcon] = useState('Activity');

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setFrequency(initialData.frequency);
      setSelectedDays(initialData.frequencyDays);
      setTime(initialData.reminderTime || getNextHour());
      setDuration(initialData.duration || 30);
      setCategory(initialData.category);
      setIcon(initialData.icon);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title, frequency, selectedDays, time, duration, category, icon);
  };

  const handleFrequencyChange = (val: string) => {
    const freq = val as Frequency;
    setFrequency(freq);
    if (freq === Frequency.DAILY) {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    } else if (freq === Frequency.SPECIFIC_DAYS) {
      if (selectedDays.length === 7) setSelectedDays([1, 3, 5]);
    }
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto w-full pt-4">
      <button 
        onClick={onCancel} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} /> <span className="font-display font-bold text-xs tracking-widest uppercase">Back</span>
      </button>

      <div className="mb-6 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-display font-black text-white mb-1 tracking-wide uppercase">
          {initialData ? 'Edit Habit' : 'New Habit'}
        </h2>
        <p className="text-cyan-600 text-xs font-mono uppercase tracking-widest">
          {initialData ? 'Update your routine.' : 'Define a new goal.'}
        </p>
      </div>

      <NeonCard>
        <form onSubmit={handleSubmit}>
          <NeonInput 
            label="Habit Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Run"
            autoFocus={!initialData}
          />

          <div className="mb-8">
             <label className="block text-cyan-400 text-[10px] font-bold mb-3 uppercase tracking-[0.2em] font-display">Icon</label>
             <NeonIconSelect selected={icon} onSelect={setIcon} />
          </div>

          <div className="mb-8">
            <label className="block text-cyan-400 text-[10px] font-bold mb-3 uppercase tracking-[0.2em] font-display flex items-center gap-2">
                <Tag size={10} /> Category Protocol
            </label>
            <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] || Tag;
                const isSelected = category === cat;
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-300 group overflow-hidden ${
                            isSelected 
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                            : 'bg-[#080808] border-white/10 text-gray-500 hover:border-cyan-500/30 hover:text-gray-300'
                        }`}
                    >
                        {/* Hover/Active Background Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
                        
                        {/* Scanline Effect for Selected */}
                        {isSelected && <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>}

                        <Icon size={20} className={`relative z-10 transition-transform duration-300 ${isSelected ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:scale-110'}`} />
                        <span className="relative z-10 text-[9px] font-mono font-bold uppercase tracking-widest">{cat}</span>
                        
                        {/* Tech Corners for active state */}
                        {isSelected && <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400"></div>}
                        {isSelected && <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400"></div>}
                    </button>
                );
            })}
            </div>
          </div>

          <div className="mb-6">
              <NeonSelect 
                label="Frequency"
                value={frequency}
                onChange={handleFrequencyChange}
                options={[
                  { label: 'Daily', value: Frequency.DAILY },
                  { label: 'Custom Days', value: Frequency.SPECIFIC_DAYS }
                ]}
                icon={Repeat}
              />
          </div>

          {frequency === Frequency.SPECIFIC_DAYS && (
            <NeonDayPicker selectedDays={selectedDays} onChange={setSelectedDays} />
          )}

          <div className="grid grid-cols-2 gap-5 mb-8">
            <div>
              <label className="text-cyan-400 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] font-display flex items-center gap-2">
                <Clock size={10} /> Time
              </label>
              <div className="relative">
                <input 
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl py-4 px-3 text-cyan-50 focus:outline-none focus:border-cyan-400 font-mono text-xs [color-scheme:dark]"
                />
              </div>
            </div>
            <div>
              <label className="text-cyan-400 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] font-display flex items-center gap-2">
                <Hourglass size={10} /> Duration (m)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  min="5"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl py-4 px-3 text-cyan-50 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <NeonButton type="submit" className="w-full">
            {initialData ? 'Save Changes' : 'Create Habit'}
          </NeonButton>
        </form>
      </NeonCard>
    </div>
  );
};

export default AddHabit;