import React, { useState, useEffect, useRef } from 'react';
import { Application, User, UserRole, Profile } from '../types';
import { MOCK_APPLICATIONS, MOCK_PROFILES } from '../services/mockData';
import { IconCamera, IconMic, IconSend, IconPlus, IconImage, IconFile, IconMapPin, IconUsers, IconVideo, IconBriefcase, IconGlobe } from '../components/Icons';
import { getChatReplySuggestion } from '../services/geminiService';

interface ApplicationsTabProps {
  currentUser: User;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ currentUser }) => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  if (selectedApp) {
    return <ChatInterface application={selectedApp} currentUser={currentUser} onBack={() => setSelectedApp(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-emerald-600 text-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Applications</h1>
        <p className="text-emerald-100 text-sm">
          {currentUser.role === UserRole.EMPLOYEE ? 'Your active job applications' : 'Candidates for your jobs'}
        </p>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {MOCK_APPLICATIONS.map((app) => (
          <div 
            key={app.id} 
            onClick={() => setSelectedApp(app)}
            className="flex items-center p-4 bg-white border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="relative">
              <img 
                src={currentUser.role === UserRole.EMPLOYEE ? `https://ui-avatars.com/api/?name=${app.companyName}&background=random` : `https://ui-avatars.com/api/?name=${app.candidateName}&background=random`} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full object-cover"
              />
              {app.matchScore > 85 && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white">
                  {app.matchScore}%
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-semibold truncate text-slate-900">
                  {currentUser.role === UserRole.EMPLOYEE ? app.companyName : app.candidateName}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(app.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-slate-600 truncate mb-1">
                {currentUser.role === UserRole.EMPLOYEE ? app.jobTitle : app.jobTitle}
              </p>
              <p className="text-xs text-slate-400 truncate">{app.lastMessage}</p>
            </div>
            
            <div className="ml-2 flex flex-col items-end space-y-2">
                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    app.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                    app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {app.status}
                  </span>
            </div>
          </div>
        ))}
        {MOCK_APPLICATIONS.length === 0 && (
            <div className="p-8 text-center text-slate-400">
                No active applications. Check the Jobs tab!
            </div>
        )}
      </div>
    </div>
  );
};

// --- Contact Info / Profile Detail View ---
const ContactInfoView: React.FC<{ application: Application; currentUser: User; onBack: () => void }> = ({ application, currentUser, onBack }) => {
    // Mock data based on role
    const isEmployeeViewingEmployer = currentUser.role === UserRole.EMPLOYEE;
    const name = isEmployeeViewingEmployer ? application.companyName : application.candidateName;
    const subtitle = isEmployeeViewingEmployer ? "Logistics Company" : application.jobTitle;
    
    // If employer viewing candidate, get mock profile
    const candidateProfile = !isEmployeeViewingEmployer ? MOCK_PROFILES[0] : null;

    return (
        <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
            <header className="bg-emerald-600 text-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={onBack} className="mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-lg font-bold">{isEmployeeViewingEmployer ? 'Company Profile' : 'Candidate Profile'}</h1>
            </header>

            <div className="flex flex-col items-center pt-8 pb-6 bg-white border-b border-slate-200">
                <img 
                    src={`https://ui-avatars.com/api/?name=${name}&background=random&size=128`} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full mb-3 shadow-md"
                />
                <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
                <p className="text-slate-500">{subtitle}</p>
                
                {/* Quick Actions */}
                <div className="flex gap-4 mt-6">
                    <button className="flex flex-col items-center gap-1 min-w-[64px] group">
                         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-100 transition-colors">
                            <IconMic className="w-6 h-6"/>
                         </div>
                         <span className="text-xs text-emerald-600 font-medium">Call</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 min-w-[64px] group">
                         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-100 transition-colors">
                            <IconVideo className="w-6 h-6"/>
                         </div>
                         <span className="text-xs text-emerald-600 font-medium">Video</span>
                    </button>
                    {isEmployeeViewingEmployer && (
                         <button className="flex flex-col items-center gap-1 min-w-[64px] group">
                             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-100 transition-colors">
                                 <IconGlobe className="w-6 h-6"/>
                             </div>
                             <span className="text-xs text-emerald-600 font-medium">Website</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                {isEmployeeViewingEmployer ? (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-2">About Company</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            LogiTech Solutions is a leading logistics provider in South India, specializing in heavy vehicle transport and supply chain management.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                             <div className="flex items-center gap-3 text-sm text-slate-600">
                                 <IconMapPin className="w-4 h-4 text-emerald-500"/>
                                 <span>Hyderabad, Telangana</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-slate-600">
                                 <IconBriefcase className="w-4 h-4 text-emerald-500"/>
                                 <span>Logistics & Transportation</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-slate-600">
                                 <IconUsers className="w-4 h-4 text-emerald-500"/>
                                 <span>500-1000 Employees</span>
                             </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-slate-900">Summary</h3>
                                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100">
                                    View Resume
                                </button>
                             </div>
                             <p className="text-slate-600 text-sm">{candidateProfile?.summary || "No summary available."}</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                             <h3 className="font-bold text-slate-900 mb-2">Skills</h3>
                             <div className="flex flex-wrap gap-2">
                                 {candidateProfile?.skills.map(s => (
                                     <span key={s} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">{s}</span>
                                 ))}
                             </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                             <h3 className="font-bold text-slate-900 mb-1">Experience</h3>
                             <p className="text-emerald-700 font-bold text-lg">{candidateProfile?.experienceYears} Years</p>
                             <p className="text-slate-500 text-sm">Total relevant experience in the industry.</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Application Status</h3>
                                <p className="text-xs text-slate-500">Last updated: {new Date(application.lastActivity).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                application.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                                application.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                                {application.status}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


// --- Chat Sub-Component ---

const ChatInterface: React.FC<{ application: Application; currentUser: User; onBack: () => void }> = ({ application, currentUser, onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', text: 'Application received. Reviewing your profile.', sender: 'employer', type: 'system', timestamp: new Date(Date.now() - 10000000).toISOString() },
    { id: 'm2', text: application.lastMessage, sender: application.employerId === currentUser.id ? 'candidate' : 'employer', type: 'text', timestamp: application.lastActivity }
  ]);
  const [suggestion, setSuggestion] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
            setShowAttachments(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
     // Fetch AI suggestion
     const fetchSuggestion = async () => {
         const role = currentUser.role === UserRole.EMPLOYER ? 'employer' : 'candidate';
         const lastMsg = messages[messages.length - 1].text;
         const sugg = await getChatReplySuggestion(messages.map(m => m.text), lastMsg, role);
         setSuggestion(sugg);
     }
     fetchSuggestion();
  }, [messages, currentUser.role]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
        id: Date.now().toString(),
        text: input,
        sender: 'me',
        type: 'text',
        timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  if (viewingProfile) {
      return <ContactInfoView application={application} currentUser={currentUser} onBack={() => setViewingProfile(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#e5ded8] relative"> {/* WhatsApp-like bg color */}
        {/* Header */}
        <div 
            className="bg-emerald-600 p-3 flex items-center text-white shadow-md z-10"
        >
            <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="mr-3 p-1 rounded-full hover:bg-emerald-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div 
                onClick={() => setViewingProfile(true)}
                className="flex items-center flex-1 cursor-pointer hover:bg-emerald-700/50 p-1.5 -ml-1.5 rounded-lg transition-colors"
                title="View Profile"
            >
                <img src={`https://ui-avatars.com/api/?name=${currentUser.role === UserRole.EMPLOYEE ? application.companyName : application.candidateName}&background=random`} className="w-9 h-9 rounded-full mr-3 border border-white/30" alt=""/>
                <div>
                    <h2 className="font-semibold leading-tight">{currentUser.role === UserRole.EMPLOYEE ? application.companyName : application.candidateName}</h2>
                    <p className="text-xs text-emerald-100">{application.jobTitle} • {application.status}</p>
                </div>
            </div>
            {currentUser.role === UserRole.EMPLOYER && (
                <button 
                    onClick={(e) => { e.stopPropagation(); /* Actions logic */ }} 
                    className="bg-emerald-700 p-1.5 rounded text-xs font-bold uppercase tracking-wide hover:bg-emerald-800"
                >
                    Actions
                </button>
            )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
            {messages.map((msg, idx) => {
                const isMe = msg.sender === 'me';
                const isSystem = msg.type === 'system';
                
                if (isSystem) {
                    return (
                        <div key={idx} className="flex justify-center my-4">
                            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full shadow-sm border border-amber-200">
                                {msg.text}
                            </span>
                        </div>
                    );
                }

                return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm text-sm ${
                            isMe ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'
                        }`}>
                            <p>{msg.text}</p>
                            <span className="text-[10px] text-slate-400 block text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Suggestion Chip */}
        {suggestion && (
            <div className="px-4 py-2 bg-slate-100/80 backdrop-blur-sm border-t border-slate-200 flex overflow-x-auto gap-2">
                <button 
                    onClick={() => setInput(suggestion)}
                    className="flex-shrink-0 bg-white border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap active:scale-95 transition-transform"
                >
                    ✨ Smart Suggestion: {suggestion}
                </button>
            </div>
        )}

        {/* Attachments Menu */}
        {showAttachments && (
            <div ref={attachmentRef} className="absolute bottom-16 left-4 bg-white rounded-xl shadow-2xl p-4 grid grid-cols-3 gap-4 border border-slate-100 animate-in slide-in-from-bottom-5 z-20">
                <AttachmentOption icon={<IconFile className="w-6 h-6 text-white"/>} label="Document" color="bg-indigo-500" onClick={() => setShowAttachments(false)}/>
                <AttachmentOption icon={<IconCamera className="w-6 h-6 text-white"/>} label="Camera" color="bg-pink-500" onClick={() => setShowAttachments(false)}/>
                <AttachmentOption icon={<IconImage className="w-6 h-6 text-white"/>} label="Gallery" color="bg-purple-500" onClick={() => setShowAttachments(false)}/>
                <AttachmentOption icon={<IconMic className="w-6 h-6 text-white"/>} label="Audio" color="bg-orange-500" onClick={() => setShowAttachments(false)}/>
                <AttachmentOption icon={<IconMapPin className="w-6 h-6 text-white"/>} label="Location" color="bg-green-500" onClick={() => setShowAttachments(false)}/>
                <AttachmentOption icon={<IconUsers className="w-6 h-6 text-white"/>} label="Contact" color="bg-blue-500" onClick={() => setShowAttachments(false)}/>
            </div>
        )}

        {/* Input Area */}
        <div className="bg-white p-2 flex items-center gap-2 border-t border-slate-200">
            <button 
                onClick={() => setShowAttachments(!showAttachments)}
                className={`p-2 rounded-full transition-colors ${showAttachments ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100'}`}
            >
                <IconPlus className={`w-6 h-6 transition-transform ${showAttachments ? 'rotate-45' : ''}`} />
            </button>
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-slate-100 border-none rounded-full py-2 px-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
            </div>
            {input.trim() ? (
                <button 
                    onClick={handleSend}
                    className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <IconSend className="w-5 h-5" />
                </button>
            ) : (
                <button className="p-2 text-slate-500 hover:text-emerald-600 rounded-full hover:bg-slate-100">
                    <IconMic className="w-6 h-6" />
                </button>
            )}
        </div>
    </div>
  );
};

const AttachmentOption: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-xs text-slate-600 font-medium">{label}</span>
    </button>
);

export default ApplicationsTab;