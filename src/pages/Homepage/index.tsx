import Graph from '../../components/Graph';
import { useState } from 'react';
import GraphModel from '../../components/Graph/graph.model';
import DateRangePicker from '../../components/DateRangePicker';
import moment from 'moment';
import DateRangePickerModel from '../../components/DateRangePicker/date-range-picker.model';
import Map from '../../components/Map';
import WeatherCard from '../../components/WeatherCard';
import WeatherModel from '../../components/WeatherCard/weather-card.model';
import { BeeHiveModel } from '../../database/models';

import classes from './homepage.module.css';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/state';
import { GeoPoint } from 'firebase/firestore';
import BottomDrawer from '../../components/BottomDrawer';
import {
  Cloud,
  DateRange,
  Thermostat,
  AccessTime,
  InvertColorsTwoTone,
  Place,
} from '@mui/icons-material';
import { Dialog, IconButton, Typography, SpeedDialAction } from '@mui/material';
import SpeedDial from '../../components/SpeedDial';
import BeeHiveCard from '../../components/BeeHiveCard';

const Homepage = () => {
  const user = useSelector((state: AppState) => state.userReducer.user);

  const [graphData, setGraphData] = useState<GraphModel>(new GraphModel({}));
  const [dateRangePickerData, setDateRangePickerData] =
    useState<DateRangePickerModel>(new DateRangePickerModel({}));
  const [weatherData, setWeatherData] = useState<WeatherModel>();
  const [isWeatherCardOpen, setIsWeatherCardOpen] = useState<boolean>(false);
  const [isRangePickerOpen, setIsRangePickerOpen] = useState<boolean>(false);
  const [addBeeHiveMode, setAddBeeHiveMode] = useState<boolean>(false);
  const [newBeeHiveLocation, setNewBeeHiveLocation] = useState<GeoPoint>();

  const actions = [
    {
      icon: <Place />,
      name: 'Add Bee Hive',
      onClick: () => setAddBeeHiveMode(user?.role === 'owner'),
    },
  ];

  const getData = (hive: BeeHiveModel) => {
    const xAxis = 'timestamp';

    const lines = Object.keys(hive.data[0] || {})
      .filter((key) => key !== xAxis)
      .map((key) => {
        return { key };
      });
    setGraphData({
      data: hive.data,
      lines,
      xAxis,
    });
    setDateRangePickerData({
      ...dateRangePickerData,
      startDate: new Date(hive.data[0] ? hive.data[0][xAxis] : ''),
    });
  };

  const onDateRangeChanged = (range: { startDate: Date; endDate: Date }) => {
    if (!graphData.data) return;
    const startDate = range.startDate.getTime();
    const endDate = moment(range.endDate).add(1, 'day').valueOf();
    const data = [];
    let startIndex;
    let endIndex;
    for (let i = 0; i < graphData.data.length; i++) {
      const item = graphData.data[i];
      const date = new Date(item[graphData.xAxis]).getTime();
      if (date >= startDate) {
        data.push(item);
        if (startIndex === undefined) startIndex = i;
      }
      if (date >= endDate) {
        data.pop();
        endIndex = i - 1;
        break;
      }
    }
    if (!endIndex) endIndex = graphData.data.length - 1;
    setGraphData({ ...graphData, startIndex, endIndex });
    setDateRangePickerData({ ...dateRangePickerData, ...range });
  };

  const onMarkerClick = (hive: BeeHiveModel) => {
    getData(hive);
    setWeatherData({ location: hive.location, name: hive.name });
  };

  const center = { lng: 0, lat: 0 };
  if (user?.beeHives) {
    const beeHives = Object.entries(user.beeHives || {}).filter(
      ([key, hive]) => !hive.deletedAt,
    );
    if (beeHives.length) {
      beeHives.forEach(([key, hive]) => {
        center.lng += hive.location.longitude;
        center.lat += hive.location.latitude;
      });
      center.lng /= beeHives.length;
      center.lat /= beeHives.length;
    }
  }

  return (
    <>
      <div className={classes.map}>
        <Map
          addNew={addBeeHiveMode}
          onAddNew={(location) => setNewBeeHiveLocation(location)}
          center={new GeoPoint(center.lat, center.lng)}
          zoom={2}
          markers={Object.entries(user?.beeHives || {})
            ?.filter(([key, hive]) => !hive.deletedAt)
            .map(([key, hive]) => {
              return {
                location: hive.location,
                description: hive.description,
                name: hive.name,
                onClick: () => onMarkerClick(hive),
              };
            })}
        />
      </div>

      <BottomDrawer
        open={!!weatherData}
        onClose={() => setWeatherData(undefined)}
        title={weatherData?.name}
        additionalIconButtons={[
          { icon: <Cloud />, onClick: () => setIsWeatherCardOpen(true) },
          { icon: <DateRange />, onClick: () => setIsRangePickerOpen(true) },
        ]}
      >
        {weatherData && (
          <>
            <div className={classes.graph}>
              <Graph
                xAxis={graphData.xAxis}
                data={graphData.data}
                lines={graphData.lines}
                startIndex={graphData.startIndex}
                endIndex={graphData.endIndex}
              />
            </div>
            <Dialog
              open={isWeatherCardOpen}
              onClose={() => setIsWeatherCardOpen(false)}
            >
              <WeatherCard
                location={weatherData.location}
                name={weatherData.name || ''}
              />
              {graphData.data?.length ? (
                <div className={classes['latest-data']}>
                  <Typography
                    color='var(--color-primary)'
                    fontWeight='500'
                    variant='h6'
                    component='h6'
                  >
                    Latest Data
                  </Typography>
                  <div className={classes['latest-data-list']}>
                    <IconButton>
                      <AccessTime className={classes.icons} />
                    </IconButton>
                    <span>
                      {moment(
                        graphData.data[graphData.data.length - 1].timestamp,
                      ).format('MMM, DD YYYY - HH:mm')}
                    </span>

                    <IconButton>
                      <Thermostat className={classes.icons} />
                    </IconButton>
                    <span>
                      {`${graphData.data[
                        graphData.data.length - 1
                      ].temperature.toFixed(0)} C`}
                    </span>

                    <IconButton>
                      <InvertColorsTwoTone className={classes.icons} />
                    </IconButton>
                    <span>
                      {`${graphData.data[
                        graphData.data.length - 1
                      ].humidity.toFixed(0)} %`}
                    </span>
                  </div>
                </div>
              ) : null}
            </Dialog>
            <Dialog
              open={isRangePickerOpen}
              onClose={() => setIsRangePickerOpen(false)}
            >
              <DateRangePicker
                isResponsive={true}
                startDate={dateRangePickerData.startDate}
                endDate={dateRangePickerData.endDate}
                onDateRangeChanged={onDateRangeChanged}
              />
            </Dialog>
          </>
        )}
      </BottomDrawer>

      <Dialog
        open={!!newBeeHiveLocation}
        onClose={() => {
          setNewBeeHiveLocation(undefined);
          setAddBeeHiveMode(false);
        }}
      >
        <BeeHiveCard
          location={newBeeHiveLocation}
          afterSubmit={() => {
            setNewBeeHiveLocation(undefined);
            setAddBeeHiveMode(false);
          }}
        />
      </Dialog>
      {user?.role === 'owner' && (
        <SpeedDial>
          {actions.map((action) => (
            <SpeedDialAction
              className={classes['speed-dial-action']}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      )}
    </>
  );
};

export default Homepage;
