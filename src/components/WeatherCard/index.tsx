import config from '../../config';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import WeatherCardModel from './weather-card.model';
import classes from './weather-card.module.css';

const WeatherCard = (props: WeatherCardModel) => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: config.openWeather.key,
    lat: props.location.latitude,
    lon: props.location.longitude,
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  return (
    <div className={classes['weather-card']}>
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang='en'
        locationLabel={props.name}
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast
      />
    </div>
  );
};

export default WeatherCard;
