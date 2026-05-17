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

export type ExerciseProgress = 'Não Iniciado' | 'Em Progresso' | 'Completo';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  muscleGroup: string;
  videoUrl?: string;
  progress?: ExerciseProgress;
}

export type ExerciseDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface LibraryExercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: ExerciseDifficulty;
  videoUrl: string;
  description: string;
  trainerId?: string; // If present, it's a custom exercise by a specific trainer
  createdAt: string;
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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  category: string;
  stock: number;
  whatsappNumber: string;
  pixKey: string;
  createdAt: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type ContentType = 'article' | 'video' | 'guide';

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  url?: string;
  thumbnailUrl?: string;
  body?: string;
  trainerId: string;
  trainerName: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
