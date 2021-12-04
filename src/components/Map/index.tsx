import config from '../../config';
import GoogleMapReact from 'google-map-react';
import BeeMarker from './BeeMarker';
import MapModel from './map.model';

const Map = (props: MapModel) => {
  props = new MapModel(props);

  return (
    <>
      {props.center && (props.center.longitude || props.center.latitude) && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: config.googleMaps.key }}
          defaultCenter={{
            lat: props.center.latitude,
            lng: props.center.longitude,
          }}
          defaultZoom={props.zoom}
        >
          {props.markers.map((marker, index) => (
            <BeeMarker
              key={index}
              lat={marker.location.latitude}
              lng={marker.location.longitude}
              name={marker.name}
              onClick={marker.onClick}
            />
          ))}
        </GoogleMapReact>
      )}
    </>
  );
};

export default Map;
