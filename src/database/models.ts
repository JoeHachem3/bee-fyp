import { GeoPoint } from 'firebase/firestore/lite';
import { v4 as uuidv4 } from 'uuid';

export class FirebaseUserModel {
  email: string;
  first_name: string;
  last_name: string;
  is_admin?: boolean;
  employees?: string[];

  constructor(props: FirebaseUserModel) {
    return {
      email: props.email,
      first_name: props.first_name,
      last_name: props.last_name,
      is_admin: !!props.is_admin,
      employees: props.employees || [],
    };
  }
}

export interface UserModel {
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  employees: UserModel[];
  bee_hives: BeeHiveModel[];
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
