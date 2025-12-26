import React, { useState } from 'react';
import Layout from './components/Layout';
import { UserRole } from './types';
import { CURRENT_USER_EMPLOYEE, CURRENT_USER_EMPLOYER } from './services/mockData';
import { IconBriefcase, IconUsers } from './components/Icons';

// Views
import ApplicationsTab from './views/ApplicationsTab';
import JobsTab from './views/JobsTab';
import ProfilesTab from './views/ProfilesTab';
import ConnectTab from './views/ConnectTab';
import SettingsTab from './views/SettingsTab';

type AuthStage = 'ROLE_SELECTION' | 'LOGIN' | 'APP';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [authStage, setAuthStage] = useState<AuthStage>('ROLE_SELECTION');
  
  // Auth state for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const currentUser = currentRole === UserRole.EMPLOYEE ? CURRENT_USER_EMPLOYEE : CURRENT_USER_EMPLOYER;

  const handleRoleSelect = (role: UserRole) => {
      setCurrentRole(role);
      setAuthStage('LOGIN');
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, validate credentials here
      setAuthStage('APP');
  };

  const handleLogout = () => {
      setAuthStage('ROLE_SELECTION');
      setEmail('');
      setPassword('');
      setActiveTab('jobs');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'connect':
        return <ConnectTab />;
      case 'profiles':
        return <ProfilesTab currentUser={currentUser} />;
      case 'applications':
        return <ApplicationsTab currentUser={currentUser} />;
      case 'jobs':
        return <JobsTab currentUser={currentUser} />;
      case 'settings':
        return <SettingsTab currentUser={currentUser} onLogout={handleLogout} />;
      default:
        return <JobsTab currentUser={currentUser} />;
    }
  };

  const renderAuthScreens = () => {
      if (authStage === 'ROLE_SELECTION') {
          return (
            <div className="flex flex-col h-full bg-white p-6 justify-center">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-emerald-600 mb-2">Hire App</h1>
                    <p className="text-slate-500">Find your perfect match in seconds.</p>
                </div>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => handleRoleSelect(UserRole.EMPLOYEE)}
                        className="w-full p-6 border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute right-[-20px] top-[-20px] bg-emerald-100 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                                <IconUsers className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-700">I'm a Job Seeker</h3>
                                <p className="text-sm text-slate-500">Find jobs, create profiles, get hired.</p>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleRoleSelect(UserRole.EMPLOYER)}
                        className="w-full p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left relative overflow-hidden"
                    >
                         <div className="absolute right-[-20px] top-[-20px] bg-blue-100 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <IconBriefcase className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700">I'm an Employer</h3>
                                <p className="text-sm text-slate-500">Post jobs, screen talent, hire fast.</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
          );
      }

      if (authStage === 'LOGIN') {
          const isEmployee = currentRole === UserRole.EMPLOYEE;
          return (
            <div className="flex flex-col h-full bg-white p-8 justify-center">
                 <button onClick={() => setAuthStage('ROLE_SELECTION')} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>

                 <div className="mb-8">
                     <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back!</h2>
                     <p className="text-slate-500 text-sm">Login as {isEmployee ? 'Job Seeker' : 'Employer'}</p>
                 </div>

                 <form onSubmit={handleLogin} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email or Phone</label>
                         <input 
                            type="text" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="user@example.com"
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                         <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="••••••••"
                         />
                     </div>
                     
                     <div className="pt-4">
                        <button 
                            type="submit"
                            className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-[0.98] ${isEmployee ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                        >
                            Login
                        </button>
                     </div>
                 </form>
                 
                 <p className="mt-6 text-center text-xs text-slate-400">
                     Don't have an account? <span className="text-emerald-600 font-bold cursor-pointer">Sign Up</span>
                 </p>
            </div>
          );
      }
      return null;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-200">
       
       {/* Mobile Container */}
       <div className="w-full h-full md:h-[800px] md:w-[400px] bg-white md:rounded-3xl md:shadow-2xl overflow-hidden relative">
          {authStage !== 'APP' ? (
              renderAuthScreens()
          ) : (
            <Layout 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                role={currentRole}
            >
                {renderContent()}
            </Layout>
          )}
       </div>
    </div>
  );
};

export default App;