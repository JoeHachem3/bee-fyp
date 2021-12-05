import { GeoPoint } from 'firebase/firestore';

interface WeatherCardModel {
  location: GeoPoint;
  name?: string;
}

export default WeatherCardModel;
