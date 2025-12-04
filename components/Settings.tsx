import React from 'react';
import { NeonCard } from './NeonComponents';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface SettingsProps {
  audioEnabled: boolean;
  onToggleAudio: (enabled: boolean) => void;
  onBack: () => void;
  onResetData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ audioEnabled, onToggleAudio, onBack }) => {
  return (
    <div className="pt-4 animate-fade-in">
       <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} /> <span className="font-display font-bold text-xs tracking-widest uppercase">Back</span>
      </button>

      <div className="mb-6 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-display font-black text-white mb-1 tracking-wide uppercase">
          SYSTEM SETTINGS
        </h2>
        <p className="text-cyan-600 text-xs font-mono uppercase tracking-widest">
          Configure interface parameters.
        </p>
      </div>

      <div className="space-y-6">
        <NeonCard>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border transition-colors duration-500 ${audioEnabled ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-[#0a0a0a] border-white/10 text-gray-600'}`}>
                    {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold font-display tracking-wide">Ambient Neural Link</h3>
                    <p className="text-gray-400 text-xs font-mono leading-tight mt-1 max-w-[200px]">
                      Generative focus audio.
                    </p>
                  </div>
              </div>
              
              {/* Graphical Switch (No Text Options) */}
              <button 
                onClick={() => onToggleAudio(!audioEnabled)}
                className={`w-14 h-8 rounded-full border relative transition-all duration-500 shadow-inner ${
                  audioEnabled 
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                    : 'bg-[#050505] border-white/10'
                }`}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full transition-all duration-500 shadow-lg ${
                  audioEnabled 
                    ? 'left-7 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                    : 'left-1 bg-gray-600'
                }`}></div>
              </button>
           </div>
        </NeonCard>
      </div>
      
      <div className="mt-12 text-center">
         <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Just Do Now v2.5 // System Online</p>
      </div>
    </div>
  );
};

export default Settings;