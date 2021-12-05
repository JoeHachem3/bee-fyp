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
  worksIn?: string[];

  constructor(props: FirebaseUserModel) {
    return {
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      role: props.role || 'employee',
      worksFor: props.worksFor,
      worksIn: props.worksIn,
    };
  }
}

export interface UserModel {
  ref: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employees: { [key: string]: EmployeeModel };
  beeHives: { [key: string]: BeeHiveModel };
}

export class EmployeeModel {
  ref: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  worksIn: string[];
  worksFor: string;

  constructor(props: EmployeeModel) {
    return {
      ref: props.ref,
      email: props.email,
      firstName: props.firstName || '',
      lastName: props.lastName || '',
      role: 'employee',
      worksIn: props.worksIn || [],
      worksFor: props.worksFor || '',
    };
  }
}

export class FirebaseBeeHiveModel {
  id?: string;
  owner: string;
  name: string;
  location: GeoPoint;
  data: BeeHiveDataModel[];
  description?: string;

  constructor(props: FirebaseBeeHiveModel) {
    return {
      id: uuidv4(),
      owner: props.owner,
      name: props.name,
      location: props.location,
      data: props.data,
      description: props.description || '',
    };
  }
}

export interface BeeHiveModel {
  ref: string;
  id: string;
  owner: string;
  name: string;
  location: GeoPoint;
  data: BeeHiveDataModel[];
  description?: string;
  deletedAt?: string;
}

export interface BeeHiveDataModel {
  humidity: number;
  temperature: number;
  timestamp: string;
}

export type UserRole = 'employee' | 'owner' | 'admin';
