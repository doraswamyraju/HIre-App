import React, { useState } from 'react';
import { Job, User, UserRole } from '../types';
import { MOCK_JOBS } from '../services/mockData';
import { generateMatchExplanation } from '../services/geminiService';
import { IconBriefcase, IconSparkles, IconX } from '../components/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface JobsTabProps {
  currentUser: User;
}

const JobsTab: React.FC<JobsTabProps> = ({ currentUser }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (selectedJob) {
    return <JobDetail job={selectedJob} currentUser={currentUser} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm z-10 sticky top-0">
        <h1 className="text-xl font-bold text-slate-800">
            {currentUser.role === UserRole.EMPLOYEE ? 'Jobs for You' : 'Your Job Postings'}
        </h1>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'High Match', 'Nearby', 'New'].map(filter => (
                <button key={filter} className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium whitespace-nowrap hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-200 transition-all">
                    {filter}
                </button>
            ))}
        </div>
      </header>

      <div className="p-4 space-y-4 overflow-y-auto">
        {MOCK_JOBS.map((job) => (
          <div 
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform cursor-pointer relative overflow-hidden"
          >
            {currentUser.role === UserRole.EMPLOYEE && job.matchScore && job.matchScore > 80 && (
                 <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    {job.matchScore}% MATCH
                 </div>
            )}

            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{job.company}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 my-3">
                {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-50 pt-3 mt-1">
                <span className="flex items-center gap-1">
                   📍 {job.location}
                </span>
                <span className="font-semibold text-slate-700">
                    {job.salary}
                </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-2 text-right">Posted {job.postedAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Job Detail Sub-Component ---

const JobDetail: React.FC<{ job: Job; currentUser: User; onBack: () => void }> = ({ job, currentUser, onBack }) => {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);

    const handleExplain = async () => {
        setLoadingAI(true);
        const expl = await generateMatchExplanation(job.description, "Candidate has 10 years experience, heavy license, lives in Hyderabad."); // Mocked profile context for simplicity
        setExplanation(expl);
        setLoadingAI(false);
    };

    // Mock data for analytics chart
    const data = [
      { name: 'Applied', value: 45 },
      { name: 'Shortlisted', value: 12 },
      { name: 'Interview', value: 5 },
      { name: 'Offer', value: 2 },
    ];
    const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6', '#10b981'];

    return (
        <div className="h-full bg-white flex flex-col">
            <div className="relative h-40 bg-slate-800">
                <img src={`https://source.unsplash.com/random/800x400/?office,work`} className="w-full h-full object-cover opacity-50" alt="Banner"/>
                <button onClick={onBack} className="absolute top-4 left-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
            </div>

            <div className="px-5 py-6 -mt-6 bg-white rounded-t-3xl flex-1 overflow-y-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                        <p className="text-emerald-600 font-medium">{job.company}</p>
                    </div>
                    {currentUser.role === UserRole.EMPLOYEE && (
                        <div className="bg-emerald-50 text-emerald-700 font-bold text-xl px-3 py-1 rounded-lg border border-emerald-100">
                            {job.matchScore}%
                        </div>
                    )}
                </div>

                <div className="flex gap-4 my-6 text-sm text-slate-600">
                    <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1 text-center">
                        <span className="block text-slate-400 text-xs uppercase mb-1">Salary</span>
                        <span className="font-semibold text-slate-800">{job.salary}</span>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1 text-center">
                        <span className="block text-slate-400 text-xs uppercase mb-1">Type</span>
                        <span className="font-semibold text-slate-800">{job.type}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <section>
                        <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
                    </section>

                    <section>
                         <h3 className="font-bold text-slate-900 mb-2">Requirements</h3>
                         <div className="flex flex-wrap gap-2">
                             {job.skills.map(s => (
                                 <span key={s} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-100">
                                     {s}
                                 </span>
                             ))}
                         </div>
                    </section>
                    
                    {currentUser.role === UserRole.EMPLOYER ? (
                        <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                             <h3 className="font-bold text-slate-900 mb-4">Hiring Funnel Analytics</h3>
                             <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <XAxis dataKey="name" tick={{fontSize: 10}} stroke="#94a3b8" />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                            cursor={{fill: 'transparent'}}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {data.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                        </section>
                    ) : (
                         <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                    <IconSparkles className="w-4 h-4 text-indigo-500"/> Smart Match Analysis
                                </h3>
                                {!explanation && (
                                    <button 
                                        onClick={handleExplain} 
                                        disabled={loadingAI}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loadingAI ? 'Analyzing...' : 'Why do I match?'}
                                    </button>
                                )}
                            </div>
                            {explanation && (
                                <p className="text-indigo-800 text-sm leading-relaxed animate-fade-in">
                                    {explanation}
                                </p>
                            )}
                        </section>
                    )}
                </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                {currentUser.role === UserRole.EMPLOYEE ? (
                    <button className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">
                        Apply Now
                    </button>
                ) : (
                    <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-colors">
                        Edit Job Posting
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobsTab;