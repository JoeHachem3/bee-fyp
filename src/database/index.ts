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
const apiariesCollection = collection(db, 'apiaries');

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
    const error = await createUser(credentials);
    return error;
  } catch (error) {
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
    const apiaries = await getApiariesByOwnerEmail(user.worksFor);
    user.apiaries = {};
    apiaries.forEach((apiary) => {
      if (user.worksIn.includes(apiary.id)) user.apiaries[apiary.id] = apiary;
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
      return 'Email Already Exists.';
    }
    await addDoc(usersCollection, user);
  } catch (e) {
    return 'Something Went Wrong. Please Try again Later.';
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
export async function createBeeHive(
  beeHive: models.BeeHiveModel,
  apiary: models.ApiaryModel,
) {
  try {
    apiary.beeHives.push(new models.BeeHiveModel(beeHive));
    updateDoc(doc(db, 'apiaries', apiary.ref), { beeHives: apiary.beeHives });
  } catch (e) {
    console.error('Error adding document: ', e);
    return e;
  }
}

export async function updateBeeHive(
  apiary: models.ApiaryModel,
  id: string,
  credentials: models.Optional<models.BeeHiveModel>,
) {
  apiary.beeHives.forEach((beeHive) => {
    if (beeHive.id === id) {
      beeHive = { ...beeHive, ...credentials };
    }
  });
  updateDoc(doc(db, 'apiaries', apiary.ref), { beeHives: apiary.beeHives });
}

// Apiaries
export function onApiariesChanged(ownerEmail: string) {
  const q = query(apiariesCollection, where('owner', '==', ownerEmail));
  onSnapshot(q, (querySnapshot) => {
    const apiaries = {};
    querySnapshot.forEach(async (doc) => {
      const apiary = { ...doc.data(), ref: doc.id } as models.ApiaryModel;
      apiaries[apiary.id] = apiary;
    });

    store.dispatch(userActions.setApiaries(apiaries));
  });
}

export async function getApiaryById(id: string) {
  const q = query(apiariesCollection, where('id', '==', id));
  const apiariesSnapshot = await getDocs(q);
  const apiaries = apiariesSnapshot.docs.map((doc) => ({
    ...doc.data(),
    ref: doc.id,
  }));
  return apiaries;
}

export async function getApiariesByOwnerEmail(
  ownerEmail: string,
): Promise<models.ApiaryModel[]> {
  const q = query(apiariesCollection, where('owner', '==', ownerEmail));
  const usersSnapshot = await getDocs(q);
  const apiaries = usersSnapshot.docs.map((doc) => ({
    ...doc.data(),
    ref: doc.id,
  })) as any as models.ApiaryModel[];
  return apiaries;
}

export async function createApiary(apiary: models.FirebaseApiaryModel) {
  try {
    await addDoc(apiariesCollection, new models.FirebaseApiaryModel(apiary));
  } catch (e) {
    console.error('Error adding document: ', e);
    return e;
  }
}

export async function updateApiary(
  ref: string,
  credentials: models.Optional<models.ApiaryModel>,
) {
  updateDoc(doc(db, 'apiaries', ref), credentials);
}
