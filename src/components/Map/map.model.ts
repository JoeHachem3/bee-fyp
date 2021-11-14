import { GeoPoint } from 'firebase/firestore/lite';

class MapModel {
  center?: GeoPoint;
  zoom?: number;
  markers?: {
    location: GeoPoint;
    description?: string;
    name?: string;
    onClick?: () => any;
  }[];

  constructor(props: MapModel) {
    return {
      center: props.center || new GeoPoint(0, 0),
      zoom: props.zoom || 0,
      markers: props.markers || [],
    };
  }
}

export default MapModel;
