import React from 'react';
import { User } from '../types';

interface SettingsTabProps {
  currentUser: User;
  onLogout: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="bg-white p-6 mb-4 flex items-center shadow-sm">
        <img src={currentUser.avatar} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
          <p className="text-slate-500 text-sm">{currentUser.role === 'EMPLOYEE' ? currentUser.title : currentUser.companyName}</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pb-8">
        <Section title="Account">
          <Row label="Phone Number" value="+91 98765 43210" />
          <Row label="Language" value="English (India)" />
        </Section>

        <Section title="Preferences">
          <Row label="Notifications" toggle />
          <Row label="Dark Mode" toggle />
          <Row label="Data Saver" toggle />
        </Section>

        <Section title="Privacy & Security">
           <Row label="Profile Visibility" value="Public" />
           <Row label="Blocked Contacts" value="0" />
        </Section>

        <Section title="About">
           <Row label="Version" value="1.0.0 (MVP)" />
           <Row label="Terms of Service" arrow />
           <Row label="Privacy Policy" arrow />
        </Section>

        <button 
            onClick={onLogout}
            className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors"
        >
            Sign Out
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
        </div>
        <div className="divide-y divide-slate-50">
            {children}
        </div>
    </div>
);

const Row: React.FC<{ label: string; value?: string; toggle?: boolean; arrow?: boolean }> = ({ label, value, toggle, arrow }) => (
    <div className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer">
        <span className="text-slate-700 text-sm font-medium">{label}</span>
        <div className="flex items-center text-slate-400 text-sm">
            {value && <span>{value}</span>}
            {toggle && (
                <div className="w-10 h-6 bg-emerald-500 rounded-full relative ml-2">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
            )}
            {arrow && (
                 <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            )}
        </div>
    </div>
);

export default SettingsTab;