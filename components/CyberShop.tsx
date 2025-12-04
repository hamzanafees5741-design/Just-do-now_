import React from 'react';
import { ShopItem } from '../types';
import { NeonButton, NeonCard, NeonToggle } from './NeonComponents';
import { ShoppingBag, Zap, Shield, Crown, Lock, Info } from 'lucide-react';

interface CyberShopProps {
  credits: number;
  inventory: string[];
  onBuy: (item: ShopItem) => void;
  onToggleTheme?: () => void;
  isGoldTheme?: boolean;
}

const ITEMS: ShopItem[] = [
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protects your streak for 24 hours if you miss a day.',
    cost: 500,
    icon: 'Shield',
    effect: 'freeze',
    active: true
  },
  {
    id: 'xp_boost',
    name: 'XP Booster',
    description: '2x XP gain for the next 24 hours.',
    cost: 800,
    icon: 'Zap',
    effect: 'multiplier',
    active: true
  },
  {
    id: 'theme_gold',
    name: 'Midas Protocol',
    description: 'Unlocks the prestigious Gold visual theme for the entire app.',
    cost: 5000,
    icon: 'Crown',
    effect: 'theme',
    active: true
  }
];

const CyberShop: React.FC<CyberShopProps> = ({ credits, inventory, onBuy, onToggleTheme, isGoldTheme }) => {
  return (
    <div className="pb-24 animate-fade-in">
      <div className="mb-6 flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-display font-black text-white tracking-wide">ITEM SHOP</h2>
           <p className="text-gray-500 text-sm font-mono">Spend credits earned from habits.</p>
        </div>
        <div className="text-right bg-[#0a0a0a] border border-cyan-500/30 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.1)]">
           <span className="block text-xs text-gray-500 font-mono tracking-widest">BALANCE</span>
           <span className="text-xl font-bold text-cyan-400 font-display flex items-center justify-end gap-1">
             {credits} <span className="text-xs">$NC</span>
           </span>
        </div>
      </div>

      <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
         <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
         <div>
            <h4 className="text-cyan-400 text-xs font-bold font-display uppercase tracking-wider mb-1">How it works</h4>
            <p className="text-gray-400 text-xs font-mono leading-relaxed">
               Complete your habits daily to earn credits ($NC). Use credits here to buy upgrades. 
               Items like "Streak Freeze" automatically apply when needed. Themes can be toggled after purchase.
            </p>
         </div>
      </div>

      <div className="grid gap-4">
        {ITEMS.map(item => {
           const isOwned = inventory.includes(item.id);
           // @ts-ignore
           const Icon = item.icon === 'Shield' ? Shield : item.icon === 'Zap' ? Zap : Crown;

           return (
             <NeonCard key={item.id} className="flex items-center gap-4 relative overflow-hidden group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isOwned ? 'bg-green-950/30 border-green-500/50' : 'bg-cyan-950/20 border-cyan-500/30'}`}>
                   <Icon size={28} className={isOwned ? 'text-green-400' : 'text-cyan-400'} />
                </div>
                
                <div className="flex-1">
                   <h3 className="text-white font-bold font-display tracking-wide">{item.name}</h3>
                   <p className="text-gray-400 text-xs font-mono leading-tight mt-1">{item.description}</p>
                   
                   {/* Theme Toggle if Owned */}
                   {item.id === 'theme_gold' && isOwned && onToggleTheme && (
                     <div className="mt-3">
                       <button 
                         onClick={onToggleTheme}
                         className={`text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider border ${isGoldTheme ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' : 'bg-gray-800 text-gray-400 border-gray-600'}`}
                       >
                         {isGoldTheme ? 'Theme Active' : 'Enable Theme'}
                       </button>
                     </div>
                   )}
                </div>

                <div>
                   {isOwned ? (
                     <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                       <Lock size={10} className="text-green-400" /> OWNED
                     </div>
                   ) : (
                     <button 
                       onClick={() => onBuy(item)}
                       disabled={credits < item.cost}
                       className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                         credits >= item.cost 
                           ? 'bg-cyan-400 text-black border-cyan-300 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                           : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-50'
                       }`}
                     >
                       {item.cost} $NC
                     </button>
                   )}
                </div>
             </NeonCard>
           );
        })}
      </div>
    </div>
  );
};

export default CyberShop;