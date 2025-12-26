import React, { useState } from 'react';
import { User, UserRole, Profile } from '../types';
import { MOCK_PROFILES, MOCK_POOLS } from '../services/mockData';
import { IconMic, IconCamera, IconUsers } from '../components/Icons';
import { generateProfileFromTranscript } from '../services/geminiService';

interface ProfilesTabProps {
  currentUser: User;
}

const ProfilesTab: React.FC<ProfilesTabProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'pools'>('profiles');
  const [isRecording, setIsRecording] = useState(false);
  const [profiles, setProfiles] = useState(MOCK_PROFILES);

  const handleGenerateProfile = async () => {
    // Simulating a recording and AI generation
    setIsRecording(true);
    setTimeout(async () => {
        const mockTranscript = "I have been working as a warehouse supervisor for 5 years. I know how to manage inventory, use Excel, and lead a team of 10 people.";
        const newProfileData = await generateProfileFromTranscript(mockTranscript);
        
        if (newProfileData) {
            const newProfile: Profile = {
                id: `p${Date.now()}`,
                userId: currentUser.id,
                roleTitle: newProfileData.roleTitle || 'New Profile',
                summary: newProfileData.summary || 'Smart Generated Summary',
                experienceYears: newProfileData.experienceYears || 0,
                skills: newProfileData.skills || [],
                location: currentUser.location || 'Unknown',
                isDefault: false
            };
            setProfiles([...profiles, newProfile]);
        }
        setIsRecording(false);
    }, 2000);
  };

  if (currentUser.role === UserRole.EMPLOYER) {
      return (
          <div className="h-full flex flex-col">
               <header className="bg-emerald-600 text-white p-6 shadow-md">
                  <h1 className="text-2xl font-bold mb-1">Talent Pools</h1>
                  <p className="text-emerald-100 text-sm">Organize and track your candidate pipelines</p>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {MOCK_POOLS.map(pool => (
                      <div key={pool.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-lg text-slate-800">{pool.name}</h3>
                              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                                  {pool.count} Candidates
                              </span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                              {pool.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                      #{tag}
                                  </span>
                              ))}
                          </div>
                          <button className="w-full mt-4 py-2 text-sm text-emerald-600 font-medium border border-emerald-100 rounded-lg hover:bg-emerald-50">
                              View Candidates
                          </button>
                      </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-medium hover:border-emerald-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2">
                      <IconUsers className="w-5 h-5"/> Create New Pool
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <header className="bg-white p-6 shadow-sm z-10">
          <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-900">My Profiles</h1>
              <button 
                onClick={handleGenerateProfile}
                disabled={isRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium shadow-lg transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                  {isRecording ? (
                      <>Recording...</>
                  ) : (
                      <>
                        <IconMic className="w-4 h-4"/> Create New
                      </>
                  )}
              </button>
          </div>
          <p className="text-slate-500 text-sm">
              Use different profiles for different job roles (e.g. Driver, Electrician).
          </p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {profiles.map((profile) => (
            <div key={profile.id} className={`bg-white p-5 rounded-xl border-2 transition-all ${profile.isDefault ? 'border-emerald-500 shadow-md ring-4 ring-emerald-50' : 'border-transparent shadow-sm hover:border-slate-200'}`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{profile.roleTitle}</h3>
                    {profile.isDefault && <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Default</span>}
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{profile.summary}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.slice(0,4).map(skill => (
                        <span key={skill} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                            {skill}
                        </span>
                    ))}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <span className="text-xs text-slate-400">{profile.experienceYears} Years Exp. • {profile.location}</span>
                    <button className="text-emerald-600 text-sm font-medium hover:underline">Edit</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesTab;