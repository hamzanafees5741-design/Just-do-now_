import React, { useState } from 'react';
import { Habit, UserStats } from '../types';
import { NeonCard, NeonProgress, NeonButton } from './NeonComponents';
import { generatePerformanceReport } from '../services/geminiService';
import { Trophy, Target, Hexagon, Brain, Shield, Grid, Cpu, Heart, Briefcase, Monitor, Users, FileText, Loader2, RotateCcw, Zap } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  xp: number;
  level: number;
  attributes?: UserStats['attributes'];
}

const Dashboard: React.FC<DashboardProps> = ({ habits, xp, level, attributes }) => {
  const [report, setReport] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Default attributes if not present
  const stats = attributes || {
    vitality: 0,
    intellect: 0,
    willpower: 0,
    tech: 0,
    charisma: 0
  };

  const totalCompletions = habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  
  // New Leveling Logic: 500 XP per level
  const xpPerLevel = 500;
  const currentLevelXp = xp - (level * xpPerLevel);
  const progress = (currentLevelXp / xpPerLevel) * 100;

  // Consistency Heatmap Generator (Last 14 days)
  const getHeatmapData = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      
      let intensity = 0;
      habits.forEach(h => {
        if (h.logs[str]) intensity++;
      });
      days.push({ date: str, intensity });
    }
    return days;
  };

  const heatmapData = getHeatmapData();

  const handleRunDiagnostic = async () => {
    setAnalyzing(true);
    setReport(null);
    const result = await generatePerformanceReport(habits);
    setReport(result);
    setAnalyzing(false);
  };

  // Helper for 3D Skill Bar
  const SkillBar = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => {
     // Convert 0-100 value to simple level. Starting at Level 1 even with 0 points.
     const skillLevel = Math.floor(value / 10) + 1;
     const barColor = color === 'cyan' ? 'bg-cyan-500' : color === 'green' ? 'bg-green-500' : color === 'purple' ? 'bg-purple-500' : color === 'amber' ? 'bg-amber-500' : 'bg-pink-500';
     const glowColor = color === 'cyan' ? 'shadow-cyan-500/50' : color === 'green' ? 'shadow-green-500/50' : color === 'purple' ? 'shadow-purple-500/50' : color === 'amber' ? 'shadow-amber-500/50' : 'shadow-pink-500/50';

     return (
        <div className="mb-4">
           <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 text-xs font-bold font-display uppercase tracking-widest text-gray-300">
                 <Icon size={12} className={`text-${color}-400`} /> {label}
              </div>
              <span className={`text-[10px] font-mono font-bold text-${color}-400`}>LVL {skillLevel}</span>
           </div>
           
           <div className="h-3 w-full bg-black border border-white/10 rounded-sm relative overflow-hidden shadow-inner">
              <div 
                className={`h-full ${barColor} relative transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${glowColor} shadow-md`} 
                style={{ width: `${Math.max(2, value)}%` }}
              >
                 {/* Glossy top */}
                 <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50 opacity-50"></div>
                 {/* Diagonal shine */}
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
              </div>
           </div>
        </div>
     )
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Player Identity Card */}
      <NeonCard className="bg-gradient-to-br from-black to-[#0a0a0a]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-xl bg-cyan-900/10 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-cyan-400/10 blur-xl animate-pulse"></div>
               <Hexagon size={32} className="text-cyan-400 relative z-10 group-hover:rotate-180 transition-transform duration-700" />
             </div>
             <div>
                <h2 className="text-4xl font-display font-black text-white italic tracking-tighter drop-shadow-lg">
                  LVL.{level}
                </h2>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <p className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.2em]">User Online</p>
                </div>
             </div>
          </div>
          <div className="text-right">
             <span className="text-3xl font-bold text-yellow-500 font-display drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">{xp}</span>
             <span className="text-[9px] text-gray-500 font-mono block tracking-[0.3em] mt-1">TOTAL XP</span>
          </div>
        </div>
        
        <div className="relative pt-2">
            <div className="flex justify-between mb-1">
               <span className="text-[9px] text-cyan-400 font-mono">NEXT LEVEL</span>
               <span className="text-[9px] text-gray-500 font-mono">{Math.floor(progress)}%</span>
            </div>
            <NeonProgress value={progress} max={100} />
        </div>
      </NeonCard>

      {/* AI Performance Analysis Section */}
      <div className="relative">
        <NeonCard className="border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-cyan-400" />
                    <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] font-display">
                        Neural Diagnostics
                    </h3>
                 </div>
            </div>

            {report ? (
                <div className="animate-fade-in">
                    <div className="bg-[#050505] rounded-xl p-4 border border-cyan-500/20 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-line shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                        {report}
                    </div>
                    <button 
                        onClick={handleRunDiagnostic}
                        className="mt-4 w-full text-[10px] text-cyan-500/70 hover:text-cyan-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={10} /> Re-run Analysis
                    </button>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-gray-500 text-xs font-mono mb-4">
                        Initialize AI analysis of habit efficiency and streak data.
                    </p>
                    <NeonButton 
                        onClick={handleRunDiagnostic} 
                        className="w-full"
                        disabled={analyzing}
                    >
                        {analyzing ? (
                            <><Loader2 className="animate-spin" size={16} /> ANALYZING BIOMETRICS...</>
                        ) : (
                            <><FileText size={16} /> RUN SYSTEM DIAGNOSTIC</>
                        )}
                    </NeonButton>
                </div>
            )}
        </NeonCard>
      </div>

      {/* SKILL ATTRIBUTES (Replaced Radar Chart) */}
      <NeonCard>
         <div className="flex items-center gap-2 mb-6">
            <Brain size={16} className="text-cyan-400" />
            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] font-display">
               Player Attributes
            </h3>
         </div>
         
         <div className="space-y-1">
             <SkillBar label="Health" value={stats.vitality} icon={Heart} color="green" />
             <SkillBar label="Work" value={stats.intellect} icon={Briefcase} color="cyan" />
             <SkillBar label="Willpower" value={stats.willpower} icon={Zap} color="amber" />
             <SkillBar label="Tech" value={stats.tech} icon={Monitor} color="purple" />
             <SkillBar label="Social" value={stats.charisma} icon={Users} color="pink" />
         </div>
      </NeonCard>

      {/* Consistency Heatmap */}
      <NeonCard>
          <div className="flex items-center gap-2 mb-4">
             <Grid size={16} className="text-purple-400" />
             <h3 className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em] font-display">
                Global Activity Grid
             </h3>
          </div>
          <div className="flex justify-between gap-1 h-12">
             {heatmapData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                   {/* Tooltip */}
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 text-[8px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {d.date}
                   </div>
                   
                   <div 
                      className={`w-full rounded-sm transition-all duration-500 hover:brightness-150 ${d.intensity > 0 ? 'bg-cyan-500 shadow-[0_0_10px_#00f3ff]' : 'bg-gray-800'}`} 
                      style={{ 
                         height: d.intensity === 0 ? '10%' : `${Math.min(100, d.intensity * 25)}%`,
                         opacity: d.intensity === 0 ? 0.3 : 1
                      }}
                   ></div>
                </div>
             ))}
          </div>
          <div className="mt-2 flex justify-between text-[8px] font-mono text-gray-600 uppercase">
             <span>2 Weeks Ago</span>
             <span>Today</span>
          </div>
      </NeonCard>

      <div className="grid grid-cols-3 gap-3">
        <NeonCard className="text-center py-5 px-1 bg-black/40">
          <Target className="mx-auto text-cyan-400 mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" size={24} />
          <p className="text-gray-500 text-[8px] font-mono uppercase tracking-widest mb-1">Total</p>
          <p className="text-2xl font-display font-bold text-white">
            {totalCompletions}
          </p>
        </NeonCard>
        <NeonCard className="text-center py-5 px-1 bg-black/40">
          <Trophy className="mx-auto text-yellow-500 mb-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={24} />
          <p className="text-gray-500 text-[8px] font-mono uppercase tracking-widest mb-1">Streak</p>
          <p className="text-2xl font-display font-bold text-white">
            {bestStreak}
          </p>
        </NeonCard>
        <NeonCard className="text-center py-5 px-1 bg-black/40">
          <Shield className="mx-auto text-purple-500 mb-2 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" size={24} />
          <p className="text-gray-500 text-[8px] font-mono uppercase tracking-widest mb-1">Habits</p>
          <p className="text-2xl font-display font-bold text-white">
            {habits.length}
          </p>
        </NeonCard>
      </div>
    </div>
  );
};

export default Dashboard;