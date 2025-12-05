import React, { useState } from 'react';
import { Habit } from '../types';
import { Trash2, Play, Clock, Inbox, Edit, X, Save, RotateCcw, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { NeonToggle, ConsoleRow, NeonChargeButton, NeonSlider, NeonButton } from './NeonComponents';

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
  const [showAll, setShowAll] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null); 
  
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];
  const currentDayIndex = todayDate.getDay(); 

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

  timelineHabits.sort((a, b) => (a.reminderTime || '').localeCompare(b.reminderTime || ''));

  const handleInitialToggle = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit && habit.logs[todayStr]) {
       onToggle(id);
    } else {
       setRatingHabitId(id);
       setEfficiencyRating(100);
    }
  };

  const confirmCompletion = () => {
    if (ratingHabitId) {
       onToggle(ratingHabitId, efficiencyRating);
       setRatingHabitId(null);
    }
  };

  const renderHabitRow = (habit: Habit, isTimelineItem: boolean = false) => {
    const log = habit.logs[todayStr];
    const isCompleted = !!log;
    const isExpanded = expandedId === habit.id;
    
    return (
      <div key={habit.id} className="mb-2 group">
        <ConsoleRow 
          onClick={() => {
            setExpandedId(isExpanded ? null : habit.id);
            setDeleteConfirmId(null); 
          }}
          className={`relative overflow-hidden ${isCompleted ? 'opacity-60' : ''}`}
        >
           {/* Active Indicator Line (Left) */}
           {!isCompleted && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyan-600 rounded-l-lg"></div>}
           
           <div className="flex items-center justify-between p-4 h-16">
              <div className="flex items-center gap-3 pl-2">
                 <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-white' : 'text-gray-600'}`}>
                    <ChevronRight size={16} />
                 </div>

                 <div>
                    <h3 className={`font-mono text-sm font-medium tracking-wide ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                       {habit.title}
                    </h3>
                    {habit.reminderTime && (
                         <span className="text-[10px] text-gray-600 font-mono block mt-0.5">
                           {habit.reminderTime}
                         </span>
                    )}
                 </div>
              </div>

              <div className="flex items-center gap-4">
                  {/* Status Badges similar to screenshot "Alert 2" */}
                  {!isCompleted && (
                      <div className="flex items-center gap-3">
                         {habit.streak > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded-full">
                                <span className="text-orange-500">
                                   <AlertTriangle size={10} fill="currentColor" />
                                </span>
                                <span className="text-[10px] font-mono font-bold text-gray-400">{habit.streak}</span>
                            </div>
                         )}
                         
                         {habit.duration && (
                            <span className="text-gray-500 font-mono text-xs">{habit.duration}m</span>
                         )}
                      </div>
                  )}

                  {/* Completion Circle - Blue Check Style */}
                  <NeonChargeButton 
                    completed={isCompleted} 
                    onComplete={() => handleInitialToggle(habit.id)} 
                  />
              </div>
           </div>

           {/* Expanded Detail Panel */}
           {isExpanded && (
             <div className="px-4 pb-4 pt-0 border-t border-white/5 bg-[#0e0e0e]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pt-3">
                    <div className="flex gap-2">
                        {!isCompleted && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onFocus(habit); }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider transition-all border border-transparent hover:border-white/10"
                            >
                                <Play size={10} fill="currentColor" /> Start Focus
                            </button>
                        )}
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                            className="text-gray-500 hover:text-white px-3 py-1.5 text-[10px] font-bold uppercase"
                        >
                            Edit
                        </button>
                        
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (deleteConfirmId === habit.id) {
                                    onDelete(habit.id);
                                } else {
                                    setDeleteConfirmId(habit.id);
                                    setTimeout(() => setDeleteConfirmId(null), 3000);
                                }
                            }}
                            className={`text-[10px] font-bold uppercase transition-all px-3 py-1.5 rounded-md 
                                ${deleteConfirmId === habit.id 
                                    ? 'bg-red-900/50 text-red-200 border border-red-800' 
                                    : 'text-gray-500 hover:text-red-400'
                                }`}
                        >
                            {deleteConfirmId === habit.id ? 'Confirm?' : 'Delete'}
                        </button>
                    </div>
                </div>
             </div>
           )}
        </ConsoleRow>
      </div>
    );
  };

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 opacity-50">
        <Inbox size={48} className="text-gray-800 mb-4" />
        <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">No logs found.</p>
      </div>
    );
  }

  return (
    <div className="pb-32">
       {/* Efficiency Rating Modal */}
       {ratingHabitId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 animate-fade-in">
             <div className="w-full max-w-sm bg-[#111] border border-white/10 p-6 rounded-xl relative shadow-2xl">
                <button onClick={() => setRatingHabitId(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                
                <h3 className="text-lg font-mono font-bold text-white mb-1">Log Efficiency</h3>
                <p className="text-gray-500 text-xs font-mono mb-6">Rate your performance session.</p>
                
                <div className="mb-8">
                   <NeonSlider value={efficiencyRating} onChange={setEfficiencyRating} />
                </div>
                
                <NeonButton onClick={confirmCompletion} className="w-full">
                   <Check size={16} /> Commit Log
                </NeonButton>
             </div>
          </div>
       )}

      <div className="flex justify-center mb-6">
        <div className="w-full max-w-xs">
            <NeonToggle 
                value={showAll} 
                onChange={setShowAll} 
                leftLabel="TODAY'S LOGS" 
                rightLabel="ALL PROTOCOLS" 
            />
        </div>
      </div>

      <div className="space-y-1">
        {showAll ? (
          allHabits.map(habit => renderHabitRow(habit))
        ) : (
          <>
            {inboxHabits.map(habit => renderHabitRow(habit))}
            {timelineHabits.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-3 px-1">
                         <Clock size={12} className="text-gray-600" />
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Scheduled</span>
                    </div>
                    {timelineHabits.map(habit => renderHabitRow(habit, true))}
                </div>
            )}
            {inboxHabits.length === 0 && timelineHabits.length === 0 && (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                   <p className="text-gray-600 font-mono text-xs">All systems nominal. No pending tasks.</p>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HabitList;