import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// --- MOCKS & PLACEHOLDERS (To make the code run without external files) ---

// Mock Data
const CURRENT_USER_EMPLOYEE = { name: "John Doe", role: "EMPLOYEE" };
const CURRENT_USER_EMPLOYER = { name: "Jane Smith", role: "EMPLOYER" };
const UserRole = { EMPLOYEE: 'EMPLOYEE', EMPLOYER: 'EMPLOYER' };

// Mock Icons
const IconUsers = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconBriefcase = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Mock Layout Component
const Layout = ({ children, activeTab, onTabChange, role }) => (
  <div className="flex flex-col h-full">
    <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
      <h1 className="font-bold text-emerald-600">Hire App Dashboard</h1>
      <div className="flex gap-2">
        {['jobs', 'applications', 'profiles', 'settings'].map(tab => (
           <button 
             key={tab}
             onClick={() => onTabChange(tab)}
             className={`px-3 py-1 rounded text-sm capitalize ${activeTab === tab ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-slate-500'}`}
           >
             {tab}
           </button>
        ))}
      </div>
    </header>
    <main className="flex-1 overflow-auto bg-slate-50 p-4 relative">
      {children}
    </main>
  </div>
);

// Mock Tab Views
const JobsTab = ({ currentUser }) => <div className="p-4 text-center text-slate-500">Jobs Tab Content (Placeholder)</div>;
const ApplicationsTab = ({ currentUser }) => <div className="p-4 text-center text-slate-500">Applications Tab Content (Placeholder)</div>;
const ProfilesTab = ({ currentUser }) => <div className="p-4 text-center text-slate-500">Profiles Tab Content (Placeholder)</div>;
const ConnectTab = () => <div className="p-4 text-center text-slate-500">Connect Tab Content (Placeholder)</div>;
const SettingsTab = ({ currentUser, onLogout }) => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-bold mb-4">Settings</h2>
    <button onClick={onLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium">Log Out</button>
  </div>
);


// --- MAIN APP COMPONENT (Your Logic) ---

const App = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [currentRole, setCurrentRole] = useState(UserRole.EMPLOYEE);
  const [authStage, setAuthStage] = useState('ROLE_SELECTION');
  
  // Auth state for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const currentUser = currentRole === UserRole.EMPLOYEE ? CURRENT_USER_EMPLOYEE : CURRENT_USER_EMPLOYER;

  const handleRoleSelect = (role) => {
      setCurrentRole(role);
      setAuthStage('LOGIN');
  };

  const handleLogin = (e) => {
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
            <div className="flex flex-col h-full bg-white p-8 justify-center relative">
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

// --- MOUNT THE APP ---
const root = createRoot(document.getElementById('root'));
root.render(<App />);
