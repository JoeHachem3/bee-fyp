import MapModel from './map.model';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { Typography } from '@mui/material';
import L from 'leaflet';
import { useState } from 'react';
import { GeoPoint } from 'firebase/firestore';
import classes from './map.module.css';

const Map = (props: MapModel) => {
  props = new MapModel(props);

  const icon = new L.Icon({
    iconUrl: props.icon,
    iconRetinaUrl: props.icon,
    iconAnchor: new L.Point(0, 0),
    popupAnchor: new L.Point(16, 0),
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(32, 32),
    className: 'leaflet-icon',
  });

  const NewBeeHiveMarker = () => {
    const map = useMapEvents({
      click: (e) => {
        if (!props.addNew) return;

        e.latlng.lng = e.latlng.lng % 180;
        if (e.latlng.lat > 84 || e.latlng.lat < -85.1) {
          e.latlng.lat = 0;
        }
        map.flyTo(e.latlng, map.getZoom());
        props.onAddNew(new GeoPoint(e.latlng.lat, e.latlng.lng));
      },
    });

    return <></>;
  };

  return (
    <MapContainer
      center={[props.center.latitude, props.center.longitude]}
      zoom={props.zoom}
      scrollWheelZoom={true}
      minZoom={2}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {props.markers.map((marker, index) => (
        <Marker
          key={index}
          eventHandlers={{
            click: marker.onClick,
            mouseover: (e) => {
              e.target.openPopup();
            },
            mouseout: (e) => {
              e.target.closePopup();
            },
          }}
          icon={icon}
          position={[marker.location.latitude, marker.location.longitude]}
        >
          <NewBeeHiveMarker />
          <Popup>
            <Typography variant='subtitle1' component='h6'>
              {marker.name}
            </Typography>
            {marker.description && (
              <>
                <hr />
                <Typography variant='caption' component='p'>
                  {marker.description}
                </Typography>
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>

    // <GoogleMapReact
    //   bootstrapURLKeys={{ key: config.googleMaps.key }}
    //   defaultCenter={{
    //     lat: props.center.latitude,
    //     lng: props.center.longitude,
    //   }}
    //   defaultZoom={props.zoom}
    // >
    //   {props.markers.map((marker, index) => (
    //     <BeeMarker
    //       key={index}
    //       lat={marker.location.latitude}
    //       lng={marker.location.longitude}
    //       name={marker.name}
    //       onClick={marker.onClick}
    //     />
    //   ))}
    // </GoogleMapReact>
  );
};

export default Map;
