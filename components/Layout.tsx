import React, { useState } from 'react';
import { IconBriefcase, IconMessageSquare, IconUsers, IconSettings, IconGlobe, IconMic } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'EMPLOYEE' | 'EMPLOYER';
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, role }) => {
  const [isRecording, setIsRecording] = useState(false);

  const tabs = [
    { id: 'connect', icon: IconGlobe, label: 'Connect' },
    { id: 'profiles', icon: IconUsers, label: role === 'EMPLOYEE' ? 'Profiles' : 'Talent' },
    { id: 'applications', icon: IconMessageSquare, label: 'Apps' },
    { id: 'jobs', icon: IconBriefcase, label: 'Jobs' },
    { id: 'settings', icon: IconSettings, label: 'Settings' },
  ];

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start a global recording session or open a modal
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000); // Simulate mock recording
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 max-w-md mx-auto shadow-2xl relative overflow-hidden border-x border-slate-200">
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {children}
      </main>

      {/* Floating Action Button for Voice/Video Recording */}
      <div className="absolute bottom-20 right-4 z-20">
         <button 
           onClick={handleRecordClick}
           className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center ${
             isRecording 
               ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200' 
               : 'bg-emerald-600 text-white hover:bg-emerald-700'
           }`}
         >
           <IconMic className="w-6 h-6" />
         </button>
      </div>
      
      <nav className="bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-10 shrink-0 h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full space-y-1 ${
                isActive ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-emerald-50' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;