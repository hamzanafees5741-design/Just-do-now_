import React, { useState } from 'react';
import { Habit } from '../types';
import { Trash2, Play, Clock, Inbox, Edit, X, Save, RotateCcw } from 'lucide-react';
import { NeonToggle, StructuredIcon, NeonChargeButton, NeonSlider, NeonButton } from './NeonComponents';

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string, efficiency?: number) => void;
  onDelete: (id: string) => void;
  onFocus: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onToggle, onDelete, onFocus, onEdit }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ratingHabitId, setRatingHabitId] = useState<string | null>(null);
  const [efficiencyRating, setEfficiencyRating] = useState(100);
  const [showAll, setShowAll] = useState(false); // false = Today (Timeline), true = All (List)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null); 
  
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];
  const currentDayIndex = todayDate.getDay(); 

  // --- Filtering Logic ---
  const inboxHabits = habits.filter(h => 
    !h.reminderTime && 
    (h.frequencyDays.includes(currentDayIndex) || h.logs[todayStr]) &&
    !showAll
  );

  const timelineHabits = habits.filter(h => 
    h.reminderTime && 
    (h.frequencyDays.includes(currentDayIndex) || h.logs[todayStr]) &&
    !showAll
  );

  const allHabits = habits;

  // Sort timeline habits by time
  timelineHabits.sort((a, b) => (a.reminderTime || '').localeCompare(b.reminderTime || ''));

  const calculateEndTime = (startTime: string, durationMinutes: number = 30) => {
    const [hours, mins] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + durationMinutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleInitialToggle = (id: string) => {
    // If habit is already completed today, just toggle it off directly.
    const habit = habits.find(h => h.id === id);
    if (habit && habit.logs[todayStr]) {
       onToggle(id);
    } else {
       // If completing, open the efficiency rater
       setRatingHabitId(id);
       setEfficiencyRating(100);
    }
  };

  const confirmCompletion = () => {
    if (ratingHabitId) {
       onToggle(ratingHabitId, efficiencyRating);
       setRatingHabitId(null);
       
       // Trigger screen shake via DOM manually for visceral feedback
       document.body.classList.add('screen-shake');
       setTimeout(() => {
         document.body.classList.remove('screen-shake');
       }, 500);
    }
  };

  const renderHabitCard = (habit: Habit, isTimelineItem: boolean = false) => {
    const log = habit.logs[todayStr];
    const isCompleted = !!log;
    const isExpanded = expandedId === habit.id;
    
    return (
      <div 
        key={habit.id}
        className={`group relative transition-all duration-300 ${
          isTimelineItem ? 'ml-8 mb-6' : 'mb-3'
        }`}
      >
        {/* Timeline Connector Laser */}
        {isTimelineItem && (
          <div className="absolute -left-8 top-7 w-8 flex items-center">
             <div className="h-[1px] w-full bg-cyan-900/50 group-hover:bg-cyan-500 transition-colors"></div>
             <div className="w-2 h-2 rounded-sm bg-[#050505] border border-cyan-500 shadow-[0_0_10px_#00f3ff] -ml-1 z-10 relative rotate-45"></div>
          </div>
        )}

        <div 
          onClick={() => {
            setExpandedId(isExpanded ? null : habit.id);
            setDeleteConfirmId(null); 
          }}
          className={`
            relative p-4 rounded-xl cursor-pointer overflow-hidden transition-all duration-300
            border
            ${isCompleted 
              ? 'bg-black/20 border-white/5 opacity-60 grayscale-[0.8]' 
              : 'holo-card-pro hover:scale-[1.01]'
            }
          `}
        >
           {/* Cyber Corner Decals */}
           {!isCompleted && (
              <>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50"></div>
              </>
           )}

           <div className="relative flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                 <StructuredIcon icon={habit.icon} size={20} className={isCompleted ? 'grayscale opacity-50' : ''} />
                 
                 <div>
                    <div className="flex items-center gap-2">
                        <h3 className={`font-display text-sm font-bold tracking-widest uppercase transition-colors ${isCompleted ? 'text-gray-600 line-through decoration-gray-700' : 'text-gray-100 group-hover:text-neon-blue'}`}>
                        {habit.title}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1.5">
                      {habit.duration && !isCompleted && (
                        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">
                          {habit.duration}m
                        </span>
                      )}
                      {habit.reminderTime && !isTimelineItem && (
                        <span className="text-[9px] text-gray-500 flex items-center gap-1 font-mono">
                          <Clock size={10} /> {habit.reminderTime}
                        </span>
                      )}
                      
                      {/* Efficiency Badge */}
                      {isCompleted && log.efficiency !== undefined && (
                        <span className="text-[9px] font-mono font-bold text-green-400 border border-green-500/30 px-1 rounded">
                           EFF: {log.efficiency}%
                        </span>
                      )}
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                  <NeonChargeButton 
                    completed={isCompleted} 
                    onComplete={() => handleInitialToggle(habit.id)} 
                  />
              </div>
           </div>

           {/* Expanded Controls - Cyber Panel */}
           {isExpanded && (
             <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in cursor-default" onClick={(e) => e.stopPropagation()}>
                
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                    {!isCompleted && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onFocus(habit); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
                        >
                            <Play size={10} fill="currentColor" /> Start Focus
                        </button>
                    )}
                    {isCompleted && (
                        <button 
                        onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
                        >
                        <RotateCcw size={10} /> Reset Status
                        </button>
                    )}
                    </div>
                    <div className="flex gap-4 items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                            className="text-gray-500 hover:text-cyan-400 text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                        >
                            <Edit size={10} /> Edit
                        </button>
                        
                        {/* 2-Step Delete Button */}
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (deleteConfirmId === habit.id) {
                                    onDelete(habit.id);
                                } else {
                                    setDeleteConfirmId(habit.id);
                                    // Reset confirmation after 3 seconds
                                    setTimeout(() => setDeleteConfirmId(null), 3000);
                                }
                            }}
                            className={`text-[10px] font-bold uppercase transition-all flex items-center gap-1 px-2 py-1 rounded 
                                ${deleteConfirmId === habit.id 
                                    ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_red]' 
                                    : 'text-gray-500 hover:text-red-500'
                                }`}
                        >
                            <Trash2 size={10} /> {deleteConfirmId === habit.id ? 'CONFIRM?' : 'Delete'}
                        </button>
                    </div>
                </div>
             </div>
           )}
        </div>
        
        {/* Timeline Time Label */}
        {isTimelineItem && (
          <div className="absolute -left-20 top-5 w-12 text-right">
             <span className="block text-sm font-display font-bold text-gray-400 tracking-wider">{habit.reminderTime}</span>
             {habit.duration && (
               <span className="block text-[9px] text-gray-600 font-mono">{calculateEndTime(habit.reminderTime!, habit.duration)}</span>
             )}
          </div>
        )}
      </div>
    );
  };

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 opacity-60">
        <div className="w-24 h-24 rounded-full border border-dashed border-gray-800 flex items-center justify-center mb-6 relative">
           <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-xl"></div>
           <Inbox size={32} className="text-gray-700 relative z-10" />
        </div>
        <p className="text-cyan-600 font-display tracking-[0.3em] text-sm mb-2 glitch-effect">NO DATA</p>
        <p className="text-[10px] text-gray-600 font-mono uppercase">No habits found.</p>
      </div>
    );
  }

  return (
    <div className="pb-32">
       {/* Efficiency Rating Modal Overlay */}
       {ratingHabitId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
             <div className="w-full max-w-sm holo-card-pro p-6 rounded-2xl relative">
                <button onClick={() => setRatingHabitId(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                
                <h3 className="text-xl font-display font-bold text-white mb-2">Protocol Report</h3>
                <p className="text-gray-400 text-xs font-mono mb-6">Rate your execution efficiency.</p>
                
                <div className="mb-8">
                   <NeonSlider value={efficiencyRating} onChange={setEfficiencyRating} />
                </div>
                
                <NeonButton onClick={confirmCompletion} className="w-full">
                   <Save size={16} /> Confirm Data
                </NeonButton>
             </div>
          </div>
       )}

      <NeonToggle 
        value={showAll} 
        onChange={setShowAll} 
        leftLabel="TIMELINE" 
        rightLabel="ALL HABITS" 
      />

      {showAll ? (
        <div className="space-y-3">
          {allHabits.map(habit => renderHabitCard(habit))}
        </div>
      ) : (
        <div className="relative pl-4">
           {inboxHabits.length > 0 && (
             <div className="mb-12 animate-fade-in">
               <div className="flex items-center gap-2 mb-4 opacity-50">
                 <div className="h-[1px] w-4 bg-cyan-500"></div>
                 <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em] font-display">Today's Tasks</span>
               </div>
               {inboxHabits.map(habit => renderHabitCard(habit))}
             </div>
           )}

           {timelineHabits.length > 0 ? (
             <div className="relative border-l border-dashed border-cyan-900/30 ml-3 pt-4 pb-10">
                {timelineHabits.map(habit => renderHabitCard(habit, true))}
             </div>
           ) : (
             inboxHabits.length === 0 && (
               <div className="text-center py-10 border border-white/5 rounded-2xl bg-black/20">
                  <p className="text-gray-600 font-mono text-xs tracking-widest">NO TASKS SCHEDULED</p>
               </div>
             )
           )}
        </div>
      )}
    </div>
  );
};

export default HabitList;