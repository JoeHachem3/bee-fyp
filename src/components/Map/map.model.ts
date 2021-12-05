import { GeoPoint } from 'firebase/firestore';

class MapModel {
  center?: GeoPoint;
  zoom?: number;
  markers?: {
    location: GeoPoint;
    description?: string;
    name?: string;
    onClick?: () => any;
  }[];
  addNew?: boolean;
  onAddNew?: (location: GeoPoint) => any;

  constructor(props: MapModel) {
    return {
      center: props.center || new GeoPoint(0, 0),
      zoom: props.zoom || 0,
      markers: props.markers || [],
      addNew: !!props.addNew,
      onAddNew: props.onAddNew || ((location: GeoPoint) => {}),
    };
  }
}

export default MapModel;
