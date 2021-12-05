import config from '../../config';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import WeatherCardModel from './weather-card.model';
import classes from './weather-card.module.css';

const WeatherCard = (props: WeatherCardModel) => {
  const customStyles = {
    fontFamily: 'Poppins, sans-serif',
    gradientStart: 'var(--color-background)',
    gradientMid: 'var(--color-background-110)',
    gradientEnd: 'var(--color-background-110)',
    locationFontColor: 'var(--color-primary)',
    todayTempFontColor: 'var(--color-primary)',
    todayDateFontColor: 'var(--color-text-90)',
    todayRangeFontColor: 'var(--color-text-90)',
    todayDescFontColor: 'var(--color-text-90)',
    todayInfoFontColor: 'var(--color-text-90)',
    todayIconColor: 'var(--color-primary)',
    forecastBackgroundColor: 'var(--color-background)',
    forecastSeparatorColor: 'var(--color-background-90)',
    forecastDateColor: 'var(--color-text-90)',
    forecastDescColor: 'var(--color-text-90)',
    forecastRangeColor: 'var(--color-text-90)',
    forecastIconColor: 'var(--color-primary)',
  };

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
        theme={customStyles}
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
