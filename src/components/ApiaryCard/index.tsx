import classes from './apiary-card.module.css';
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Backdrop,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { isValueValid } from '../../utility/input-validation';
import { useEffect, useState } from 'react';
import { initialApiaryForm } from './config';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/state';
import { GeoPoint } from 'firebase/firestore';
import { createApiary } from '../../database';

const ApiaryCard = (props: {
  location?: GeoPoint;
  afterSubmit?: () => any;
}) => {
  const user = useSelector((state: AppState) => state.userReducer.user);
  const [apiaryForm, setApiaryForm] =
    useState<typeof initialApiaryForm>(initialApiaryForm);

  const [isValid, setIsValid] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (props.location) {
      setApiaryForm({
        ...apiaryForm,
        latitude: {
          ...apiaryForm.latitude,
          value: props.location.latitude,
          disabled: !!props.location.latitude,
        },
        longitude: {
          ...apiaryForm.longitude,
          value: props.location.longitude,
          disabled: !!props.location.longitude,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, props.location]);

  const onInputChange = (event, key: string) => {
    if (!apiaryForm[key]) return;
    const valid = apiaryForm[key].noValidate
      ? true
      : isValueValid(event.target.value, apiaryForm[key].type);
    let isValid = true;
    Object.keys(apiaryForm).forEach((k) => {
      isValid = isValid && (k === key ? valid : apiaryForm[k].valid);
    });
    setApiaryForm({
      ...apiaryForm,
      [key]: {
        ...apiaryForm[key],
        valid,
        value: event.target.value,
        touched: true,
      },
    });
    setIsValid(isValid);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let error;
    setIsLoading(true);

    const credentials = {
      name: apiaryForm.name.value,
      description: apiaryForm.description.value,
      owner: user.email,
      location: new GeoPoint(
        apiaryForm.latitude.value,
        apiaryForm.longitude.value,
      ),
    };

    error = await createApiary(credentials);
    setIsLoading(false);

    if (error) {
      setIsLoading(false);
      setErrorMessage('Something Went Wrong. Please Try again Later.');
    } else props.afterSubmit && props.afterSubmit();
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: 'var(--color-background-110)',
        }}
        className={classes['apiary-card']}
      >
        <CardContent
          sx={{
            color: 'var(--color-text)',
          }}
          className={classes['card-content']}
        >
          <form
            className={classes['form']}
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            {Object.keys(apiaryForm).map((key) => (
              <TextField
                className={classes['text-field']}
                fullWidth
                focused
                key={key}
                variant='filled'
                type={apiaryForm[key].type}
                label={apiaryForm[key].label}
                placeholder={apiaryForm[key].placeholder}
                value={apiaryForm[key].value}
                color={
                  apiaryForm[key].valid || !apiaryForm[key].touched
                    ? 'primary'
                    : 'warning'
                }
                disabled={apiaryForm[key].disabled}
                multiline={apiaryForm[key].multiline}
                onChange={(e) => onInputChange(e, key)}
              />
            ))}

            {errorMessage && (
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-warning)',
                }}
              >
                {errorMessage}
              </Typography>
            )}
            <LoadingButton
              className={`${classes['create-button']} ${
                isLoading ? classes.loading : ''
              }`}
              sx={{ marginTop: '1em' }}
              type='submit'
              disabled={!isValid}
              variant='contained'
              color='primary'
              fullWidth
              size='large'
              loading={isLoading}
            >
              Create
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
      <Backdrop open={isLoading} />
    </>
  );
};

export default ApiaryCard;
