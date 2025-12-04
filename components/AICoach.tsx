import React, { useState, useEffect, useRef } from 'react';
import { Habit } from '../types';
import { getDetailedCoaching } from '../services/geminiService';
import { NeonInput, NeonButton, NeonCard } from './NeonComponents';
import { Bot, Send, User, Terminal, Cpu } from 'lucide-react';

interface AICoachProps {
  habits: Habit[];
}

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  isSystemLog?: boolean;
}

const AICoach: React.FC<AICoachProps> = ({ habits }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef(false);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    const sequence = [
        { text: "> ESTABLISHING NEURAL HANDSHAKE...", delay: 400, isSystem: true },
        { text: "> SYNCING BIOMETRIC DATA...", delay: 1200, isSystem: true },
        { text: "> ACCESSING HABIT DATABASE...", delay: 2000, isSystem: true },
        { text: "> SYSTEM READY. V2.5 ONLINE.", delay: 2800, isSystem: true },
        { text: "Identity confirmed. Welcome back, Operator. I am Neon. My directive is your absolute optimization. How shall we proceed with the upgrade?", delay: 3800, isSystem: false }
    ];

    sequence.forEach((item, index) => {
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: Date.now() + index, 
                role: 'ai', 
                text: item.text, 
                isSystemLog: item.isSystem 
            }]);
        }, item.delay);
    });

  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getDetailedCoaching(habits, userMsg.text);
    
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col pt-4">
       <div className="flex items-center gap-2 mb-4 px-2 opacity-70">
         <Terminal size={14} className="text-cyan-400" />
         <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">/usr/bin/neon_coach</span>
         <span className="animate-pulse text-cyan-400">_</span>
       </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            
            {msg.isSystemLog ? (
                <div className="pl-14 w-full mb-1">
                    <p className="font-mono text-[10px] text-cyan-700/80 tracking-[0.2em] uppercase typing-effect border-l-2 border-cyan-900/30 pl-2">
                        {msg.text}
                    </p>
                </div>
            ) : (
                <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                    msg.role === 'ai' 
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                    : 'bg-zinc-900 border-zinc-700'
                }`}>
                    {msg.role === 'ai' ? <Bot size={20} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" /> : <User size={20} className="text-gray-400" />}
                </div>

                <div className={`p-4 rounded-2xl text-sm leading-relaxed relative ${
                    msg.role === 'ai' 
                    ? 'bg-[#0a0a0a] border border-cyan-900/50 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-tl-none' 
                    : 'bg-zinc-900 border border-zinc-700 text-gray-200 rounded-tr-none'
                }`}>
                    {/* Decorative Corner for AI messages */}
                    {msg.role === 'ai' && <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-cyan-400"></div>}
                    
                    {msg.text}
                </div>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse pl-14">
             <div className="flex items-center gap-2 text-cyan-500/50 font-mono text-xs">
                <Cpu size={14} className="animate-spin" /> PROCESSING DIRECTIVE...
             </div>
          </div>
        )}
      </div>

      <NeonCard className="p-3 bg-black/80 backdrop-blur-xl border-cyan-500/20">
        <form onSubmit={handleSend} className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input command..."
            className="flex-1 bg-transparent text-cyan-50 placeholder-cyan-900/60 focus:outline-none font-mono text-sm px-2 h-full"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </form>
      </NeonCard>
    </div>
  );
};

export default AICoach;