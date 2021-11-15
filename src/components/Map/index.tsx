import config from '../../config';
import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import BeeMarker from './BeeMarker';
import MapModel from './map.model';

const Map = (props: MapModel) => {
  const [propState, setPropState] = useState<MapModel>(new MapModel({}));

  useEffect(() => {
    setPropState(new MapModel(props));
  }, [props]);

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: config.googleMaps.key }}
      defaultCenter={{
        lat: propState.center.latitude,
        lng: propState.center.longitude,
      }}
      defaultZoom={propState.zoom}
    >
      {propState.markers.map((marker, index) => (
        <BeeMarker
          key={index}
          lat={marker.location.latitude}
          lng={marker.location.longitude}
          name={marker.name}
          onClick={marker.onClick}
        />
      ))}
    </GoogleMapReact>
  );
};

export default Map;
