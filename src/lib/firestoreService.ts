import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile, StudentData, Workout, CheckinEntry } from "../types";

export const FirestoreService = {
  // --- Users ---
  async createUserProfile(profile: UserProfile) {
    await setDoc(doc(db, "users", profile.uid), {
      ...profile,
      createdAt: serverTimestamp()
    });
  },

  async getUserProfile(uid: string) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  // --- Students ---
  async createStudentProfile(studentId: string, data: StudentData) {
    await setDoc(doc(db, "students", studentId), data);
  },

  subscribeToStudents(trainerId: string, callback: (students: any[]) => void) {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    // In a real app, we'd filter by a specific relationship if trainerId mattered for privacy
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
  },

  // --- Workouts ---
  async saveWorkout(workout: Omit<Workout, 'id'>) {
    return await addDoc(collection(db, "workouts"), workout);
  },

  // --- Checkins ---
  async logCheckin(studentId: string) {
    return await addDoc(collection(db, "checkins"), {
      studentId,
      timestamp: serverTimestamp()
    });
  },
  
  subscribeToCheckins(callback: (checkins: CheckinEntry[]) => void) {
    const q = query(collection(db, "checkins"));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CheckinEntry)));
    });
  }
};
