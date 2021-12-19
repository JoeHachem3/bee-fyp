import { GeoPoint } from 'firebase/firestore';
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
  apiaries: { [key: string]: ApiaryModel };
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

export class FirebaseApiaryModel {
  id?: string;
  owner: string;
  name: string;
  location: GeoPoint;
  beeHives?: BeeHiveModel[];
  description?: string;

  constructor(props: FirebaseApiaryModel) {
    return {
      id: uuidv4(),
      owner: props.owner,
      name: props.name,
      location: props.location,
      beeHives:
        props.beeHives?.map((beeHive) => new BeeHiveModel(beeHive)) || [],
      description: props.description || '',
    };
  }
}

export interface ApiaryModel {
  ref: string;
  id: string;
  owner: string;
  name: string;
  location: GeoPoint;
  beeHives: BeeHiveModel[];
  description?: string;
  deletedAt?: string;
}

export class BeeHiveModel {
  id?: string;
  name: string;
  data: BeeHiveDataModel[];

  constructor(props: BeeHiveModel) {
    return {
      id: uuidv4(),
      name: props.name,
      data: props.data,
    };
  }
}

export interface BeeHiveDataModel {
  humidity: number;
  temperature: number;
  weight: number;
  flow: number;
  timestamp: string;
}

export type UserRole = 'employee' | 'owner' | 'admin';
