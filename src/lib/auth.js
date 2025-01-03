// lib/auth.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { signInWithEmailAndPassword, getAuth as getClientAuth } from 'firebase/auth';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export async function createUserSession(email, password) {
  const auth = getAuth();
  
  try {
    // Verify the user exists
    const userRecord = await auth.getUserByEmail(email);
    
    // Create a custom token
    const customToken = await auth.createCustomToken(userRecord.uid);
    
    // Exchange custom token for ID token (this would typically be done client-side)
    const clientAuth = getClientAuth();
    const userCredential = await signInWithCustomToken(clientAuth, customToken);
    const idToken = await userCredential.user.getIdToken();
    
    return {
      idToken,
      userData: {
        email: userRecord.email,
        uid: userRecord.uid
      }
    };
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Authentication failed');
  }
}

export async function validateSession(sessionCookie) {
  if (!sessionCookie) return null;
  
  try {
    const auth = getAuth();
    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Get full user data
    const userRecord = await auth.getUser(decodedClaims.uid);
    
    return {
      email: userRecord.email,
      uid: userRecord.uid
    };
  } catch (error) {
    console.error('Error validating session:', error.message);
    return null;
  }
}