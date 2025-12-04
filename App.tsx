import React, { useState, useEffect } from 'react';
import { Habit, Frequency, ViewState, ShopItem, UserStats } from './types';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import FocusTimer from './components/FocusTimer';
import CyberShop from './components/CyberShop';
import Settings from './components/Settings';
import CyberAmbience from './components/CyberAmbience';
import { Plus, BrainCircuit, ShoppingBag, Battery, Signal, ListTodo, Activity, Settings as SettingsIcon, Hexagon } from 'lucide-react';

const STORAGE_KEY = 'just-do-now-habits';
const XP_KEY = 'just-do-now-xp';
const CREDITS_KEY = 'just-do-now-credits';
const INVENTORY_KEY = 'just-do-now-inventory';
const ATTRIBUTES_KEY = 'just-do-now-attributes';
const AUDIO_PREF_KEY = 'just-do-now-audio';

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [xp, setXp] = useState(0);
  const [credits, setCredits] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  // Changed default start from 20 to 0 for a fresh Level 1 start
  const [attributes, setAttributes] = useState<UserStats['attributes']>({
    vitality: 0, intellect: 0, willpower: 0, tech: 0, charisma: 0
  });
  
  const [view, setView] = useState<ViewState>('habits');
  const [activeFocusHabit, setActiveFocusHabit] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isGoldTheme, setIsGoldTheme] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Splash Screen Timer
    const fadeTimer = setTimeout(() => {
        setIsFading(true);
    }, 2200);

    const removeTimer = setTimeout(() => {
        setShowSplash(false);
    }, 2800);

    return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
    };
  }, []);

  // Load from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedXp = localStorage.getItem(XP_KEY);
    const storedCredits = localStorage.getItem(CREDITS_KEY);
    const storedInventory = localStorage.getItem(INVENTORY_KEY);
    const storedAttributes = localStorage.getItem(ATTRIBUTES_KEY);
    const storedAudio = localStorage.getItem(AUDIO_PREF_KEY);

    let parsedHabits: Habit[] = [];
    if (stored) {
      parsedHabits = JSON.parse(stored);
      setHabits(parsedHabits);
    }
    
    if (storedXp) setXp(parseInt(storedXp));
    if (storedCredits) setCredits(parseInt(storedCredits));
    if (storedInventory) setInventory(JSON.parse(storedInventory));
    if (storedAudio) setIsAudioEnabled(JSON.parse(storedAudio));
    
    if (storedAttributes) {
       const attrs = JSON.parse(storedAttributes);
       const totalCompletions = parsedHabits.reduce((acc: number, h: Habit) => acc + Object.keys(h.logs).length, 0);
       if (totalCompletions === 0 && attrs.vitality === 20) {
          setAttributes({ vitality: 0, intellect: 0, willpower: 0, tech: 0, charisma: 0 });
       } else {
          setAttributes(attrs);
       }
    } else {
       setAttributes({ vitality: 0, intellect: 0, willpower: 0, tech: 0, charisma: 0 });
    }
  }, []);

  // Save to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    localStorage.setItem(XP_KEY, xp.toString());
    localStorage.setItem(CREDITS_KEY, credits.toString());
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    localStorage.setItem(ATTRIBUTES_KEY, JSON.stringify(attributes));
    localStorage.setItem(AUDIO_PREF_KEY, JSON.stringify(isAudioEnabled));
  }, [habits, xp, credits, inventory, attributes, isAudioEnabled]);

  const updateAttributes = (category: string, isPositive: boolean, efficiency: number = 100) => {
    const multiplier = 0.5 + (efficiency / 100);
    const baseChange = isPositive ? 2 : -2;
    const change = Math.round(baseChange * multiplier);

    setAttributes(prev => {
      const next = { ...prev };
      switch (category) {
        case 'Health': next.vitality = Math.min(100, Math.max(0, next.vitality + change)); break;
        case 'Work': next.intellect = Math.min(100, Math.max(0, next.intellect + change)); break;
        case 'Skill': next.tech = Math.min(100, Math.max(0, next.tech + change)); break;
        case 'Mindset': next.willpower = Math.min(100, Math.max(0, next.willpower + change)); break;
        case 'Routine': next.willpower = Math.min(100, Math.max(0, next.willpower + change)); break;
        default: next.charisma = Math.min(100, Math.max(0, next.charisma + change)); break;
      }
      return next;
    });
  };

  const handleSaveHabit = (title: string, frequency: Frequency, frequencyDays: number[], time: string, duration: number, category: string, icon: string) => {
    if (editingHabit) {
      setHabits(prev => prev.map(h => 
        h.id === editingHabit.id 
          ? { ...h, title, frequency, frequencyDays: frequency === Frequency.DAILY ? [0,1,2,3,4,5,6] : frequencyDays, reminderTime: time || undefined, duration, category, icon }
          : h
      ));
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        title,
        frequency,
        frequencyDays: frequency === Frequency.DAILY ? [0,1,2,3,4,5,6] : frequencyDays,
        reminderTime: time || undefined,
        duration: duration || 30,
        category,
        icon,
        createdAt: new Date().toISOString(),
        logs: {},
        streak: 0
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setView('habits');
  };

  const toggleHabit = (id: string, efficiency: number = 100) => {
    const today = new Date().toISOString().split('T')[0];
    let xpChange = 0;
    let creditsChange = 0;
    let targetHabit: Habit | undefined;

    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      targetHabit = habit;

      const newLogs = { ...habit.logs };
      let isCompleting = false;

      if (newLogs[today]) {
        delete newLogs[today];
        xpChange = -10; 
        creditsChange = -20; 
      } else {
        newLogs[today] = { date: today, completed: true, efficiency };
        isCompleting = true;
        xpChange = 10 + Math.floor((efficiency / 100) * 10); 
        creditsChange = 20 + Math.floor((efficiency / 100) * 10);
      }

      let streak = 0;
      if (isCompleting) {
        let currentCheck = new Date();
        while (true) {
          const dateStr = currentCheck.toISOString().split('T')[0];
          if (newLogs[dateStr]) {
            streak++;
            currentCheck.setDate(currentCheck.getDate() - 1);
          } else {
            break;
          }
        }
      } else {
         streak = habit.streak > 0 ? habit.streak - 1 : 0;
      }

      return { ...habit, logs: newLogs, streak };
    }));

    setXp(prev => Math.max(0, prev + xpChange));
    setCredits(prev => Math.max(0, prev + creditsChange));
    
    if (targetHabit) {
      // @ts-ignore
      updateAttributes(targetHabit.category, xpChange > 0, efficiency);
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const startFocus = (habit: Habit) => {
    setActiveFocusHabit(habit);
    setView('focus');
  };

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit);
    setView('add');
  };

  const handleAddClick = () => {
    setEditingHabit(null);
    setView('add');
  };

  const completeFocus = () => {
    if (activeFocusHabit) {
      toggleHabit(activeFocusHabit.id, 100); 
    }
  };

  const handleBuyItem = (item: ShopItem) => {
    if (credits >= item.cost && !inventory.includes(item.id)) {
      setCredits(prev => prev - item.cost);
      setInventory(prev => [...prev, item.id]);
    }
  };
  
  const handleResetData = () => {
     setHabits([]);
     setXp(0);
     setCredits(0);
     setInventory([]);
     setAttributes({ vitality: 0, intellect: 0, willpower: 0, tech: 0, charisma: 0 });
     localStorage.clear();
     setView('habits');
  };

  const getLevel = () => Math.floor(xp / 500);
  const systemIntegrity = Math.min(100, Math.max(5, ((xp % 500) / 500) * 100));

  return (
    <div className={`min-h-screen font-sans overflow-hidden relative selection:bg-cyan-500 selection:text-black ${isGoldTheme ? 'grayscale-0' : ''}`}>
      
      {/* --- SPLASH SCREEN --- */}
      {showSplash && (
        <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#030303] transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            {/* Background Atmosphere */}
            <div className="bg-carbon absolute inset-0 z-0"></div>
            {/* Reusing Vignette for Neon Edge Consistency */}
            <div className="absolute inset-0 z-10 vignette"></div>
            
            <div className="relative z-20 flex flex-col items-center">
                {/* Logo Icon */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-30 animate-pulse"></div>
                    <Hexagon size={72} className="text-cyan-400 relative z-10 animate-bounce" strokeWidth={2} />
                    <div className="absolute inset-0 border border-cyan-500/30 rounded-full scale-150 animate-ping opacity-20"></div>
                </div>
                
                {/* Text */}
                <h1 className="text-4xl md:text-5xl font-black font-display tracking-[0.2em] text-white glitch-effect drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                    JUST DO NOW
                </h1>
                
                {/* Loading Bar */}
                <div className="mt-10 w-48 h-1 bg-gray-900/50 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-load-bar"></div>
                </div>
                <p className="mt-4 text-[10px] font-mono text-cyan-600 uppercase tracking-widest animate-pulse">
                    ESTABLISHING CONNECTION...
                </p>
            </div>
        </div>
      )}

      {/* --- LIVING CYBER ENVIRONMENT --- */}
      <div className="bg-noise z-0"></div>
      <div className="bg-carbon fixed inset-0 z-[-1]"></div>
      <div className="vignette z-40"></div>
      <div className={`cyber-grid ${isGoldTheme ? 'opacity-30 mix-blend-overlay' : ''}`}></div>
      <div className="scanlines z-50"></div>

      {/* --- AMBIENT AUDIO SYSTEM --- */}
      <CyberAmbience enabled={isAudioEnabled && (view === 'habits' || view === 'focus')} />

      {/* Header */}
      {view !== 'focus' && view !== 'settings' && (
        <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/5 shadow-[0_5px_50px_rgba(0,0,0,1)]">
          <div className="max-w-xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-8 bg-cyan-500 rounded-sm shadow-[0_0_15px_#00f3ff] animate-pulse"></div>
              <div>
                <h1 className="text-xl font-black font-display tracking-[0.1em] text-white glitch-effect leading-none">
                  JUST DO NOW
                </h1>
              </div>
            </div>

            {/* Top Stats & Actions */}
            <div className="flex items-center gap-3">
               <div className="px-3 py-1.5 bg-[#0a0a0a] border border-cyan-500/30 rounded-lg flex items-center gap-2 shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                 <Battery size={14} className={systemIntegrity > 50 ? "text-green-400" : "text-yellow-400"} />
                 <span className="text-xs font-bold font-mono text-gray-200">LVL {getLevel()}</span>
               </div>
              
              <button 
                onClick={handleAddClick}
                className="bg-cyan-500 hover:bg-cyan-400 text-black p-2 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:scale-105 active:scale-95"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`relative z-10 max-w-xl mx-auto px-6 ${view === 'focus' ? 'h-screen pt-4' : 'pt-28 pb-32'}`}>
        {view === 'habits' && (
          <HabitList 
            habits={habits} 
            onToggle={toggleHabit} 
            onDelete={deleteHabit}
            onFocus={startFocus}
            onEdit={handleEditClick}
          />
        )}

        {view === 'add' && (
          <AddHabit 
            onSave={handleSaveHabit} 
            onCancel={() => {
              setEditingHabit(null);
              setView('habits');
            }} 
            initialData={editingHabit}
          />
        )}

        {view === 'stats' && (
          <Dashboard habits={habits} xp={xp} level={getLevel()} attributes={attributes} />
        )}

        {view === 'coach' && (
          <AICoach habits={habits} />
        )}

        {view === 'focus' && activeFocusHabit && (
          <FocusTimer 
            habit={activeFocusHabit} 
            onComplete={completeFocus}
            onBack={() => setView('habits')}
          />
        )}
        
        {view === 'shop' && (
          <CyberShop 
            credits={credits} 
            inventory={inventory} 
            onBuy={handleBuyItem} 
            onToggleTheme={() => setIsGoldTheme(!isGoldTheme)}
            isGoldTheme={isGoldTheme}
          />
        )}

        {view === 'settings' && (
          <Settings 
             audioEnabled={isAudioEnabled} 
             onToggleAudio={setIsAudioEnabled} 
             onBack={() => setView('habits')}
             onResetData={handleResetData}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {view !== 'add' && view !== 'focus' && view !== 'settings' && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-sm z-50">
          <div className="bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,1)] p-2 flex justify-between items-center px-2 relative overflow-hidden ring-1 ring-white/5">
             
            <NavButton 
              active={view === 'habits'} 
              onClick={() => setView('habits')} 
              icon={<ListTodo size={20} />} 
              label="PLAN" 
            />
            <NavButton 
              active={view === 'stats'} 
              onClick={() => setView('stats')} 
              icon={<Activity size={20} />} 
              label="STATS" 
            />
             <NavButton 
              active={view === 'shop'} 
              onClick={() => setView('shop')} 
              icon={<ShoppingBag size={20} />} 
              label="SHOP" 
            />
            <NavButton 
              active={view === 'coach'} 
              onClick={() => setView('coach')} 
              icon={<BrainCircuit size={20} />} 
              label="AI" 
            />
          </div>
        </nav>
      )}
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all duration-300 group ${
      active 
        ? 'text-cyan-400 bg-white/5' 
        : 'text-gray-600 hover:text-cyan-200 hover:bg-white/5'
    }`}
  >
    <div className={`transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]' : ''}`}>
      {icon}
    </div>
    <span className={`text-[8px] font-black font-display tracking-widest transition-opacity ${active ? 'opacity-100 text-shadow-glow' : 'opacity-0'}`}>
      {label}
    </span>
    {active && <div className="absolute top-0 w-8 h-[2px] bg-cyan-500 shadow-[0_0_10px_#00f3ff]"></div>}
  </button>
);

export default App;