import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  HandCoins, 
  TrendingUp, 
  History,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { ViewType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'balance' as ViewType, label: 'Balance', icon: LayoutDashboard },
    { id: 'daily' as ViewType, label: 'Daily', icon: PlusCircle },
    { id: 'cash' as ViewType, label: 'Cash', icon: Wallet },
    { id: 'receivable' as ViewType, label: 'Receivable', icon: HandCoins },
    { id: 'future' as ViewType, label: 'Future', icon: TrendingUp },
    { id: 'history' as ViewType, label: 'History', icon: History },
    { id: 'yearly' as ViewType, label: 'Yearly', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe-area-inset-bottom z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon size={20} className={cn("mb-1", isActive && "animate-in fade-in zoom-in duration-300")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
