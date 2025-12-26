import { Job, Application, User, UserRole, Profile, TalentPool } from '../types';

export const CURRENT_USER_EMPLOYEE: User = {
  id: 'u1',
  name: 'Rajesh Kumar',
  role: UserRole.EMPLOYEE,
  avatar: 'https://picsum.photos/100/100',
  location: 'Hyderabad',
  title: 'Senior Driver'
};

export const CURRENT_USER_EMPLOYER: User = {
  id: 'u2',
  name: 'Sarah Jenkins',
  role: UserRole.EMPLOYER,
  avatar: 'https://picsum.photos/101/101',
  companyName: 'LogiTech Solutions'
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Heavy Vehicle Driver',
    company: 'LogiTech Solutions',
    location: 'Hyderabad',
    salary: '₹25,000 - ₹30,000',
    type: 'Full-time',
    postedAt: '2h ago',
    description: 'Looking for experienced heavy vehicle drivers for inter-city logistics. Must have valid heavy license and 5+ years experience.',
    skills: ['Heavy License', 'Night Shift', 'Route Knowledge'],
    matchScore: 92
  },
  {
    id: 'j2',
    title: 'Warehouse Supervisor',
    company: 'Amazon Delivers',
    location: 'Secunderabad',
    salary: '₹35,000',
    type: 'Full-time',
    postedAt: '1d ago',
    description: 'Manage incoming inventory and supervise loading dock staff.',
    skills: ['Team Management', 'Inventory', 'Excel'],
    matchScore: 75
  },
  {
    id: 'j3',
    title: 'Delivery Partner',
    company: 'Swiggy',
    location: 'Gachibowli',
    salary: '₹18,000 + Incentives',
    type: 'Part-time',
    postedAt: '4h ago',
    description: 'Bike delivery partners needed. Flexible shifts.',
    skills: ['Two Wheeler', 'Smartphone'],
    matchScore: 88
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    candidateId: 'u1',
    employerId: 'u2',
    status: 'Interview',
    lastMessage: 'Great, see you tomorrow at 10 AM.',
    lastActivity: new Date().toISOString(),
    jobTitle: 'Heavy Vehicle Driver',
    companyName: 'LogiTech Solutions',
    candidateName: 'Rajesh Kumar',
    matchScore: 92
  },
  {
    id: 'a2',
    jobId: 'j3',
    candidateId: 'u1',
    employerId: 'u3',
    status: 'Applied',
    lastMessage: 'Application sent successfully.',
    lastActivity: new Date(Date.now() - 86400000).toISOString(),
    jobTitle: 'Delivery Partner',
    companyName: 'Swiggy',
    candidateName: 'Rajesh Kumar',
    matchScore: 88
  }
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'p1',
    userId: 'u1',
    roleTitle: 'Heavy Driver',
    summary: '10 years of experience driving heavy trucks across South India. Clean record.',
    experienceYears: 10,
    skills: ['Heavy License', 'Highway Driving', 'Basic Mechanics'],
    location: 'Hyderabad',
    isDefault: true
  },
  {
    id: 'p2',
    userId: 'u1',
    roleTitle: 'Private Chauffeur',
    summary: 'Polite and punctual driver for luxury cars.',
    experienceYears: 4,
    skills: ['English', 'Automatic Transmission', 'Navigation'],
    location: 'Hyderabad',
    isDefault: false
  }
];

export const MOCK_POOLS: TalentPool[] = [
  { id: 'tp1', name: 'Drivers - Hyderabad', count: 142, tags: ['Heavy', 'Light'] },
  { id: 'tp2', name: 'Electricians - Cyberabad', count: 45, tags: ['Industrial', 'Residential'] },
  { id: 'tp3', name: 'Warehouse Staff', count: 89, tags: ['Night Shift'] }
];
