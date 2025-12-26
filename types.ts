export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  EMPLOYER = 'EMPLOYER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  location?: string;
  title?: string; // For employees
  companyName?: string; // For employers
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  description: string;
  skills: string[];
  matchScore?: number; // Contextual to the viewing employee
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  status: 'Applied' | 'Viewed' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Offer';
  lastMessage: string;
  lastActivity: string; // ISO date
  jobTitle: string;
  companyName: string;
  candidateName: string;
  matchScore: number;
}

export interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'system' | 'voice' | 'image';
  mediaUrl?: string;
}

export interface Profile {
  id: string;
  userId: string;
  roleTitle: string; // e.g., "Driver", "Electrician"
  summary: string;
  experienceYears: number;
  skills: string[];
  location: string;
  isDefault: boolean;
}

export interface TalentPool {
  id: string;
  name: string;
  count: number;
  tags: string[];
}