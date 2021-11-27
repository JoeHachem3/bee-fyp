import config from '../config';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  onSnapshot,
  getFirestore,
  getDocs,
  addDoc,
  query,
  where,
  Query,
  collection,
} from 'firebase/firestore';
import * as models from './models';
import store from '../store';
import * as userActions from '../store/user/actions';
import { GeoPoint } from 'firebase/firestore/lite';

const firebaseConfig = config.firebase;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth();

// Auth
export async function login(credentials: { email: string; password: string }) {
  try {
    await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    );
  } catch (error) {
    const user = await getUserByEmail(credentials.email);
    console.log(user);
    if (user) {
      try {
        createUserWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password,
        );
      } catch (error) {
        return error;
      }
    } else return error;
  }
}

export async function register(
  credentials: models.FirebaseUserModel & { password: string },
) {
  try {
    const user = { ...credentials };
    delete user.password;
    await createUser(user);
    console.log(store.getState().userReducer.user);
    if (!store.getState().userReducer.user) {
      createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function logout() {
  auth.signOut();
}

// Users
export async function getUserByEmail(email: string) {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const usersSnapshot = await getDocs(q);
  const users = usersSnapshot.docs.map((doc) => doc.data());
  return users[0];
}

export async function createUser(user: models.FirebaseUserModel) {
  try {
    Object.keys(user).forEach((key) => {
      if (user[key] === undefined) delete user[key];
    });
    const docRef = await addDoc(collection(db, 'users'), user);
    console.log('Document written with ID: ', docRef.id);
    return new models.FirebaseUserModel(user);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// Employees
export function onEmployeesChanged(workingFor: string) {
  const q = query(collection(db, 'users'), where('worksFor', '==', workingFor));
  onSnapshot(q, (querySnapshot) => {
    const employees = [];
    querySnapshot.forEach((doc) => employees.push(doc.data()));
    store.dispatch(userActions.setEmployees(employees));
  });
}

// BeeHives
export function onBeeHivesChanged(ownerEmail: string) {
  const q = query(
    collection(db, 'bee-hives'),
    where('owner', '==', ownerEmail),
  );
  onSnapshot(q, (querySnapshot) => {
    const beeHives = [];
    querySnapshot.forEach((doc) => beeHives.push(doc.data()));
    store.dispatch(userActions.setBeeHives(beeHives));
  });
}

export async function getBeeHiveById(id: string) {
  const q = query(collection(db, 'bee-hives'), where('id', '==', id));
  const beeHivesSnapshot = await getDocs(q);
  const beeHives = beeHivesSnapshot.docs.map((doc) => doc.data());
  return beeHives;
}

export async function getBeeHives(): Promise<models.BeeHiveModel[]> {
  const beeHivesSnapshot = await getDocs<models.BeeHiveModel>(
    collection(db, 'bee-hives') as any as Query<models.BeeHiveModel>,
  );
  const beeHives = beeHivesSnapshot.docs.map((doc) => doc.data());
  return beeHives;
}

export async function getBeeHivesByOwnerEmail(
  ownerEmail: string,
): Promise<models.BeeHiveModel[]> {
  const q = query(
    collection(db, 'bee-hives'),
    where('owner', '==', ownerEmail),
  );
  const usersSnapshot = await getDocs(q);
  const beeHives = usersSnapshot.docs.map((doc) =>
    doc.data(),
  ) as any as models.BeeHiveModel[];
  return beeHives;
}

export async function setBeeHive(beeHive: models.BeeHiveModel) {
  try {
    const docRef = await addDoc(
      collection(db, 'bee-hives'),
      new models.BeeHiveModel(beeHive),
    );
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// console.log(
//   Math.floor(Math.random() * 180 - 90),
//   Math.floor(Math.random() * 360 - 180),
// );

// setBeeHive({
//   location: new GeoPoint(
//     Math.floor(Math.random() * 180 - 90),
//     Math.floor(Math.random() * 360 - 180),
//   ),
//   name: 'Name' + Math.random() * 10,
//   owner: 'emp1@gmail.com',
//   data: [
//     {
//       timestamp: '10/24/2021 0:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 1:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 2:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 3:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 4:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 5:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 6:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 7:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 8:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 9:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 10:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 11:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 12:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 13:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 14:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 15:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 16:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 17:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 18:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 19:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 20:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 21:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 22:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/24/2021 23:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },

//     {
//       timestamp: '10/25/2021 0:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 1:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 2:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 3:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 4:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 5:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 6:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 7:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 8:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 9:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 10:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 11:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 12:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 13:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 14:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 15:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 16:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 17:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 18:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 19:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 20:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 21:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 22:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/25/2021 23:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },

//     {
//       timestamp: '10/26/2021 0:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 1:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 2:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 3:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 4:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 5:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 6:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 7:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 8:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 9:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 10:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 11:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 12:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 13:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 14:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 15:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 16:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 17:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 18:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 19:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 20:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 21:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 22:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/26/2021 23:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },

//     {
//       timestamp: '10/27/2021 0:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 1:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 2:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 3:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 4:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 5:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 6:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 7:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 8:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 9:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 10:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 11:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 12:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 13:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 14:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 15:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 16:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 17:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 18:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 19:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 20:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 21:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 22:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//     {
//       timestamp: '10/27/2021 23:00',
//       humidity: Math.random() * 20 + 60,
//       temperature: Math.random() * 8 + 2,
//     },
//   ],
// });
