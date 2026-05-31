import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  initializeFirestore,
  enableMultiTabIndexedDbPersistence
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable long polling to bypass potential connection issues in sandboxed environment
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Enable offline persistence with multi-tab synchronization support
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be active or synchronized properly
    console.warn("Firestore multi-tab persistence precondition warning:", err.code);
  } else if (err.code === 'unimplemented') {
    // Current browser does not support persistence
    console.warn("Firestore offline persistence is unimplemented in this browser:", err.code);
  } else {
    console.warn("Firestore offline persistence failed to initialize:", err);
  }
});

export const storage = getStorage(app);

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();
