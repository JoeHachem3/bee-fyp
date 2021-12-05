import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  onSnapshot,
  getDocs,
  addDoc,
  query,
  where,
  collection,
  updateDoc,
  doc,
} from 'firebase/firestore';
import * as models from './models';
import store from '../store';
import * as userActions from '../store/user/actions';
import db from './config';

export const auth = getAuth();

const usersCollection = collection(db, 'users');
const beeHivesCollection = collection(db, 'bee-hives');

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

export async function register(credentials: models.FirebaseUserModel) {
  try {
    await createUser(credentials);
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
  const q = query(usersCollection, where('email', '==', email));
  const usersSnapshot = await getDocs(q);
  const users = usersSnapshot.docs.map((doc) => ({
    ...doc.data(),
    ref: doc.id,
  }));

  const user = users[0] as models.UserModel & models.EmployeeModel;
  if (user?.worksFor) {
    const beeHives = await getBeeHivesByOwnerEmail(user.worksFor);
    user.beeHives = {};
    beeHives.forEach((beeHive) => {
      if (user.worksIn.includes(beeHive.id))
        user.beeHives[beeHive.id] = beeHive;
    });
  }

  return user;
}

export async function createUser(user: models.FirebaseUserModel) {
  try {
    Object.keys(user).forEach((key) => {
      if (user[key] === undefined) delete user[key];
    });
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      return 'Email Already Exists';
    }
    await addDoc(usersCollection, user);
    return new models.FirebaseUserModel(user);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// Employees
export function onEmployeesChanged(worksFor: string) {
  const q = query(usersCollection, where('worksFor', '==', worksFor));
  onSnapshot(q, (querySnapshot) => {
    const newEmployees = {};
    querySnapshot.forEach((doc) => {
      const employee = {
        ...doc.data(),
        ref: doc.id,
      } as any as models.EmployeeModel;
      newEmployees[employee.email] = new models.EmployeeModel(employee);
    });

    store.dispatch(userActions.setEmployees(newEmployees));
  });
}

export async function updateEmployee(
  ref: string,
  credentials: models.Optional<models.FirebaseUserModel>,
) {
  updateDoc(doc(db, 'users', ref), credentials);
}

// BeeHives
export function onBeeHivesChanged(ownerEmail: string) {
  const q = query(beeHivesCollection, where('owner', '==', ownerEmail));
  onSnapshot(q, (querySnapshot) => {
    const beeHives = {};
    querySnapshot.forEach((doc) => {
      const beeHive = { ...doc.data(), ref: doc.id } as models.BeeHiveModel;
      beeHives[beeHive.id] = beeHive;
    });
    store.dispatch(userActions.setBeeHives(beeHives));
  });
}

export async function getBeeHiveById(id: string) {
  const q = query(beeHivesCollection, where('id', '==', id));
  const beeHivesSnapshot = await getDocs(q);
  const beeHives = beeHivesSnapshot.docs.map((doc) => ({
    ...doc.data(),
    ref: doc.id,
  }));
  return beeHives;
}

export async function getBeeHivesByOwnerEmail(
  ownerEmail: string,
): Promise<models.BeeHiveModel[]> {
  const q = query(beeHivesCollection, where('owner', '==', ownerEmail));
  const usersSnapshot = await getDocs(q);
  const beeHives = usersSnapshot.docs.map((doc) => ({
    ...doc.data(),
    ref: doc.id,
  })) as any as models.BeeHiveModel[];
  return beeHives;
}

export async function createBeeHive(beeHive: models.FirebaseBeeHiveModel) {
  try {
    console.log(beeHive);
    await addDoc(beeHivesCollection, new models.FirebaseBeeHiveModel(beeHive));
  } catch (e) {
    console.error('Error adding document: ', e);
    return e;
  }
}

export async function updateBeeHive(
  ref: string,
  credentials: models.Optional<models.BeeHiveModel>,
) {
  updateDoc(doc(db, 'bee-hives', ref), credentials);
}
