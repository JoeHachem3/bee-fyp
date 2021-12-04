import config from '../config';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = config.firebase;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
