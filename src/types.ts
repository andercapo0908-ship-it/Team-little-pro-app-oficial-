export type UserRole = 'admin' | 'trainer' | 'student';

export interface HealthMetrics {
  weight: number;
  height: number;
  bf?: number;
  goal: string;
  restrictions?: string[];
  bloodType?: string;
  heartRate?: number;
}

export interface TrainerPortfolio {
  bio: string;
  education: string[];
  experience: string;
  certifications: string[];
  specialties: string[];
  photos: string[];
}

export interface AppSettings {
  logoUrl: string;
  globalAnnouncement: string;
  coachNote: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  health?: HealthMetrics;
  portfolio?: TrainerPortfolio;
}

export interface StudentData {
  trainerId: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  groups: string[];
  status: 'active' | 'inactive';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  muscleGroup: string;
  videoUrl?: string;
  progress?: 'Não Iniciado' | 'Em Progresso' | 'Completo';
}

export interface Workout {
  id: string;
  studentId: string;
  trainerId: string;
  name: string;
  division: string;
  duration?: string;
  exercises: Exercise[];
}
