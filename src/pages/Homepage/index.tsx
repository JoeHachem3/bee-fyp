import Graph from '../../components/Graph';
import { useState } from 'react';
import GraphModel from '../../components/Graph/graph.model';
import DateRangePicker from '../../components/DateRangePicker';
import moment from 'moment';
import DateRangePickerModel from '../../components/DateRangePicker/date-range-picker.model';
import Map from '../../components/Map';
import WeatherCard from '../../components/WeatherCard';
import WeatherModel from '../../components/WeatherCard/weather-card.model';
import { ApiaryModel, BeeHiveModel } from '../../database/models';

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
  MonitorWeight,
  CompareArrows,
  Place,
} from '@mui/icons-material';
import {
  Dialog,
  IconButton,
  Typography,
  SpeedDialAction,
  Card,
  Button,
  CardActionArea,
} from '@mui/material';
import SpeedDial from '../../components/SpeedDial';
import ApiaryCard from '../../components/ApiaryCard';
import Sidebar from '../../components/Sidebar';
import BeeHiveCard from '../../components/BeeHiveCard';

const Homepage = () => {
  const user = useSelector((state: AppState) => state.userReducer.user);

  const [graphData, setGraphData] = useState<GraphModel>(new GraphModel({}));
  const [dateRangePickerData, setDateRangePickerData] =
    useState<DateRangePickerModel>(new DateRangePickerModel({}));
  const [weatherData, setWeatherData] = useState<WeatherModel>();
  const [isWeatherCardOpen, setIsWeatherCardOpen] = useState<boolean>(false);
  const [isRangePickerOpen, setIsRangePickerOpen] = useState<boolean>(false);
  const [addApiaryMode, setApiaryMode] = useState<boolean>(false);
  const [newApiaryLocation, setNewApiaryLocation] = useState<GeoPoint>();
  const [openApiary, setOpenApiary] = useState<ApiaryModel>();
  const [openBeeHive, setOpenBeeHive] = useState<BeeHiveModel>();
  const [isBeeHiveCardOpen, setIsBeeHiveCardOpen] = useState<boolean>(false);

  const actions = [
    {
      icon: <Place />,
      name: 'Add Apiary',
      onClick: () => setApiaryMode(user?.role === 'owner'),
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
      startDate: hive.data[0] ? new Date(hive.data[0][xAxis]) : new Date(),
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

  const onMarkerClick = (apiary: ApiaryModel) => {
    setOpenApiary(apiary);
    setWeatherData({ location: apiary.location, name: apiary.name });
  };

  const center = { lng: 0, lat: 0 };
  if (user?.apiaries) {
    const apiaries = Object.entries(user.apiaries || {}).filter(
      ([key, apiary]) => !apiary.deletedAt,
    );
    if (apiaries.length) {
      apiaries.forEach(([key, apiary]) => {
        center.lng += apiary.location.longitude;
        center.lat += apiary.location.latitude;
      });
      center.lng /= apiaries.length;
      center.lat /= apiaries.length;
    }
  }

  return (
    <>
      <div
        className={`${classes.map} ${addApiaryMode ? 'add-new-apiary' : ''}`}
      >
        <Map
          addNew={addApiaryMode}
          onAddNew={(location) => setNewApiaryLocation(location)}
          center={new GeoPoint(center.lat, center.lng)}
          zoom={2}
          markers={Object.entries(user?.apiaries || {})
            ?.filter(([key, apiary]) => !apiary.deletedAt)
            .map(([key, apiary]) => {
              return {
                location: apiary.location,
                description: apiary.description,
                name: apiary.name,
                onClick: () => onMarkerClick(apiary),
              };
            })}
        />
      </div>
      {openApiary && (
        <Sidebar
          anchor='right'
          open={!!openApiary}
          onClose={() => setOpenApiary(undefined)}
        >
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
              className={classes['sidebar-content']}
            >
              <Typography
                variant='h5'
                component='h3'
                display='flex'
                width='100%'
                alignItems='center'
                justifyContent='center'
                marginBottom='5rem'
              >
                {openApiary.name}
              </Typography>
              <div className={classes.beeHives}>
                {openApiary.beeHives?.map((hive) => (
                  <Card
                    key={hive.id}
                    sx={{
                      backgroundColor: 'var(--color-background-110)',
                      margin: '0.25rem',
                      height: 'min-content',
                    }}
                  >
                    <CardActionArea
                      sx={{ padding: '0.5rem !important' }}
                      onClick={() => {
                        getData(hive);
                        setOpenBeeHive(hive);
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'var(--color-text)',
                          justifyContent: 'center',
                          display: 'flex',
                        }}
                      >
                        {hive.name}
                      </Typography>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            </div>
            {user?.role === 'owner' && (
              <Button
                onClick={() => setIsBeeHiveCardOpen(true)}
                sx={{
                  textTransform: 'none',
                  color: 'var(--color-primary) !important',
                }}
                variant='text'
                color='primary'
              >
                Add New Bee Hive
              </Button>
            )}
          </>
        </Sidebar>
      )}

      <BottomDrawer
        open={!!openBeeHive}
        onClose={() => setOpenBeeHive(undefined)}
        title={openApiary?.name}
        additionalIconButtons={
          graphData.data?.length
            ? [
                { icon: <Cloud />, onClick: () => setIsWeatherCardOpen(true) },
                {
                  icon: <DateRange />,
                  onClick: () => setIsRangePickerOpen(true),
                },
              ]
            : [{ icon: <Cloud />, onClick: () => setIsWeatherCardOpen(true) }]
        }
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
                    {graphData.data[graphData.data.length - 1].timestamp !==
                      undefined && (
                      <>
                        <IconButton>
                          <AccessTime className={classes.icons} />
                        </IconButton>
                        <span>
                          {moment(
                            graphData.data[graphData.data.length - 1].timestamp,
                          ).format('MMM, DD YYYY - HH:mm')}
                        </span>
                      </>
                    )}
                    {graphData.data[graphData.data.length - 1].temperature !==
                      undefined && (
                      <>
                        <IconButton>
                          <Thermostat className={classes.icons} />
                        </IconButton>
                        <span>
                          {`${graphData.data[
                            graphData.data.length - 1
                          ].temperature.toFixed(0)} C`}
                        </span>
                      </>
                    )}
                    {graphData.data[graphData.data.length - 1].humidity !==
                      undefined && (
                      <>
                        <IconButton>
                          <InvertColorsTwoTone className={classes.icons} />
                        </IconButton>
                        <span>
                          {`${graphData.data[
                            graphData.data.length - 1
                          ].humidity.toFixed(0)} %`}
                        </span>
                      </>
                    )}
                    {graphData.data[graphData.data.length - 1].weight !==
                      undefined && (
                      <>
                        <IconButton>
                          <MonitorWeight className={classes.icons} />
                        </IconButton>
                        <span>
                          {`${graphData.data[
                            graphData.data.length - 1
                          ].weight.toFixed(0)} Kg`}
                        </span>
                      </>
                    )}
                    {graphData.data[graphData.data.length - 1].flow !==
                      undefined && (
                      <>
                        <IconButton>
                          <CompareArrows className={classes.icons} />
                        </IconButton>
                        <span>
                          {`${graphData.data[
                            graphData.data.length - 1
                          ].flow.toFixed(0)} Bees`}
                        </span>
                      </>
                    )}
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
        open={!!newApiaryLocation}
        onClose={() => {
          setNewApiaryLocation(undefined);
          setApiaryMode(false);
        }}
      >
        <ApiaryCard
          location={newApiaryLocation}
          afterSubmit={() => {
            setNewApiaryLocation(undefined);
            setApiaryMode(false);
          }}
        />
      </Dialog>

      <Dialog
        open={isBeeHiveCardOpen}
        onClose={() => setIsBeeHiveCardOpen(false)}
      >
        <BeeHiveCard
          apiary={openApiary}
          afterSubmit={() => setIsBeeHiveCardOpen(false)}
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
