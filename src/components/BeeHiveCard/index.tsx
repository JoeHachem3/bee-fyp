import classes from './bee-hive-card.module.css';
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
import { initialBeeHiveForm } from './config';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/state';
import { GeoPoint } from 'firebase/firestore';
import { createBeeHive } from '../../database';

const AuthenticationCard = (props: {
  location?: GeoPoint;
  afterSubmit?: () => any;
}) => {
  const user = useSelector((state: AppState) => state.userReducer.user);
  const [beeHiveForm, setBeeHiveForm] =
    useState<typeof initialBeeHiveForm>(initialBeeHiveForm);

  const [isValid, setIsValid] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (props.location) {
      setBeeHiveForm({
        ...beeHiveForm,
        latitude: {
          ...beeHiveForm.latitude,
          value: props.location.latitude,
          disabled: !!props.location.latitude,
        },
        longitude: {
          ...beeHiveForm.longitude,
          value: props.location.longitude,
          disabled: !!props.location.longitude,
        },
      });
    }
  }, [props, props.location]);

  const onInputChange = (event, key: string) => {
    if (!beeHiveForm[key]) return;
    const valid = beeHiveForm[key].noValidate
      ? true
      : isValueValid(event.target.value, beeHiveForm[key].type);
    let isValid = true;
    Object.keys(beeHiveForm).forEach((k) => {
      isValid = isValid && (k === key ? valid : beeHiveForm[k].valid);
    });
    setBeeHiveForm({
      ...beeHiveForm,
      [key]: {
        ...beeHiveForm[key],
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
      name: beeHiveForm.name.value,
      description: beeHiveForm.description.value,
      owner: user.email,
      location: new GeoPoint(
        beeHiveForm.latitude.value,
        beeHiveForm.longitude.value,
      ),
      data: [],
    };
    console.log(credentials);

    error = await createBeeHive(credentials);
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
        className={classes['authentication-card']}
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
            {Object.keys(beeHiveForm).map((key) => (
              <TextField
                className={classes['text-field']}
                fullWidth
                focused
                key={key}
                variant='filled'
                type={beeHiveForm[key].type}
                label={beeHiveForm[key].label}
                placeholder={beeHiveForm[key].placeholder}
                value={beeHiveForm[key].value}
                color={
                  beeHiveForm[key].valid || !beeHiveForm[key].touched
                    ? 'primary'
                    : 'warning'
                }
                disabled={beeHiveForm[key].disabled}
                multiline={beeHiveForm[key].multiline}
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
              className={`${classes['authentication-button']} ${
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

export default AuthenticationCard;
