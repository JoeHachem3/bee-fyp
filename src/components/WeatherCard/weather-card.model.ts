import { GeoPoint } from 'firebase/firestore/lite';

interface WeatherCardModel {
  location: GeoPoint;
  name?: string;
}

export default WeatherCardModel;
