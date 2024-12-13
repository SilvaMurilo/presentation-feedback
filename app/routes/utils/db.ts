import admin from "firebase-admin";
import { initializeApp as initializeAdminApp } from "firebase-admin/app";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!admin?.apps?.length) {
  initializeAdminApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
export const db = admin.firestore();
