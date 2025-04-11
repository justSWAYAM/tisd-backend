import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Replace this with your downloaded service account file path
// or use environment variables in production
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT || 
  fs.readFileSync(path.resolve('config/serviceAccountKey.json'), 'utf8')
);

// Initialize the app with a service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "process.env.FIREBASE_STORAGE_BUCKET"
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };