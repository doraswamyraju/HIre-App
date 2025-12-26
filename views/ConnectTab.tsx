import React from 'react';
import { IconGlobe } from '../components/Icons';

const ConnectTab: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8 text-center">
      <div className="bg-emerald-100 p-6 rounded-full mb-6">
        <IconGlobe className="w-16 h-16 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Connect Community</h2>
      <p className="text-slate-500 mb-8 max-w-xs">
        Network with other professionals, get referrals, and join community discussions. Coming soon!
      </p>
      <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full hover:bg-slate-50 font-medium">
        Contact Support
      </button>
    </div>
  );
};

export default ConnectTab;