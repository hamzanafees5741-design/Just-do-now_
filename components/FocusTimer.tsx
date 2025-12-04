import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { NeonButton, NeonCard } from './NeonComponents';
import { ArrowLeft, Play, Pause, Square, CheckCircle, Waves } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface FocusTimerProps {
  habit: Habit;
  onComplete: () => void;
  onBack: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ habit, onComplete, onBack }) => {
  const [timeLeft, setTimeLeft] = useState(habit.duration ? habit.duration * 60 : 25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  // @ts-ignore
  const Icon = LucideIcons[habit.icon] || LucideIcons.Activity;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessionDone(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(habit.duration ? habit.duration * 60 : 25 * 60);
    setSessionDone(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const finishSession = () => {
    onComplete();
    onBack();
  };

  return (
    <div className="animate-fade-in flex flex-col items-center h-full pt-6">
       <button 
        onClick={onBack} 
        className="self-start mb-10 flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors uppercase font-bold text-xs tracking-widest"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="relative mb-16">
        {/* Animated Rings - Reactor Core Effect */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[ping_3s_linear_infinite]"></div>
            <div className="absolute inset-[-20px] rounded-full border border-cyan-500/10 animate-[pulse_2s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-xl animate-pulse"></div>
            
            {/* Binaural Visualizer Waves (Simulated) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20">
               <div className="w-full h-full rounded-full border-4 border-t-cyan-500/50 border-transparent animate-spin duration-[3s]"></div>
            </div>
          </>
        )}
        
        {/* Main HUD Circle */}
        <div className="w-72 h-72 rounded-full border-[1px] border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(34,211,238,0.15)] flex flex-col items-center justify-center relative overflow-hidden group">
          
          {/* Internal rotating borders (pseudo) */}
          <div className={`absolute inset-2 rounded-full border-t border-cyan-500/50 ${isActive ? 'animate-spin duration-[10s]' : ''}`}></div>
          <div className={`absolute inset-4 rounded-full border-b border-cyan-500/30 ${isActive ? 'animate-spin duration-[5s] direction-reverse' : ''}`}></div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)]"></div>
          
          <Icon size={48} className={`text-cyan-500 mb-4 relative z-10 transition-all duration-1000 ${isActive ? 'drop-shadow-[0_0_15px_rgba(34,211,238,1)]' : 'opacity-70'}`} />
          
          <h2 className="text-7xl font-display font-black text-white relative z-10 neon-text-glow tracking-wider tabular-nums">
            {formatTime(timeLeft)}
          </h2>
          
          {isActive && (
             <div className="flex items-center gap-2 mt-4 relative z-10">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-400/80 font-mono uppercase tracking-[0.2em] text-[10px]">
                   Binaural Sync Active
                </p>
             </div>
          )}
          
          {!isActive && (
            <p className="text-gray-600 font-mono mt-4 relative z-10 uppercase tracking-[0.3em] text-[10px]">
               Paused
            </p>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-widest uppercase text-center max-w-xs leading-tight">
        {habit.title}
      </h3>
      <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-8">Focus Session</p>

      {sessionDone ? (
        <NeonCard className="text-center w-full max-w-sm border-green-500/30 bg-green-950/10">
          <CheckCircle className="mx-auto text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]" size={56} />
          <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-wide">COMPLETE</h3>
          <p className="text-gray-400 mb-6 font-mono text-sm">Session complete. Efficiency maximized.</p>
          <NeonButton onClick={finishSession} className="w-full" style={{backgroundColor: '#4ade80', color: 'black', boxShadow: '0 0 20px rgba(74,222,128,0.4)'}}>
            Finish
          </NeonButton>
        </NeonCard>
      ) : (
        <div className="flex gap-8 items-center">
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 group relative overflow-hidden ${
              isActive 
                ? 'bg-amber-500/10 border border-amber-500 text-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' 
                : 'bg-cyan-400 text-black shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.7)]'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            {/* Hover shine */}
            {!isActive && <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-30 group-hover:animate-shimmer" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-2xl border border-red-500/30 text-red-500 hover:bg-red-950/30 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center transition-all"
          >
            <Square size={20} fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;