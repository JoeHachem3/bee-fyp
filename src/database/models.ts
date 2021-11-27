import { GeoPoint } from 'firebase/firestore/lite';
import { v4 as uuidv4 } from 'uuid';

export type Optional<Type> = {
  [Property in keyof Type]+?: Type[Property];
};

export class FirebaseUserModel {
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  worksFor?: string;

  constructor(props: FirebaseUserModel) {
    return {
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      role: props.role || 'employee',
      worksFor: props.worksFor,
    };
  }
}

export interface UserModel {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employees: UserModel[];
  beeHives: BeeHiveModel[];
}

export class BeeHiveModel {
  id?: string;
  owner: string;
  name: string;
  location: GeoPoint;
  data: BeeHiveDataModel[];
  description?: string;

  constructor(props: BeeHiveModel) {
    return {
      id: uuidv4(),
      owner: props.owner,
      name: props.name,
      location: props.location,
      data: props.data,
      description: props.description,
    };
  }
}

export interface BeeHiveDataModel {
  humidity: number;
  temperature: number;
  timestamp: string;
}

export type UserRole = 'employee' | 'owner' | 'admin';
