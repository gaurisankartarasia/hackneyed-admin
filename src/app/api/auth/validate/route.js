// app/api/auth/validate/route.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app;
try {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
} catch (error) {
  app = getAuth().app;
}

export async function POST(request) {
  try {
    const { session } = await request.json();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(session);
    return Response.json({ user: decodedToken });
  } catch (error) {
    return Response.json({ error: 'Invalid session' }, { status: 401 });
  }
}
