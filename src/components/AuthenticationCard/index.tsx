import classes from './authentication-card.module.css';
import {
  TextField,
  Card,
  CardContent,
  Button,
  Typography,
  Backdrop,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { isValueValid } from '../../utility/input-validation';
import { useState } from 'react';
import { login, register } from '../../database';
import { initialLoginForm, initialRegisterForm } from './config';
import AuthenticationCardModel from './authentication-card.model';
import { UserRole } from '../../database/models';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/state';

const AuthenticationCard = (props: AuthenticationCardModel) => {
  const user = useSelector((state: AppState) => state.userReducer.user);
  const [loginForm, setLoginForm] =
    useState<typeof initialLoginForm>(initialLoginForm);

  const [registerForm, setRegisterForm] =
    useState<typeof initialRegisterForm>(initialRegisterForm);

  const [isLogin, setIsLogin] = useState<boolean>(
    props.show === 'login'
      ? true
      : props.show === 'register'
      ? false
      : !!props.isLogin,
  );

  const [isValid, setIsValid] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const onInputChange = (event, key: string) => {
    if (isLogin) {
      if (!loginForm[key]) return;
      const valid = isValueValid(event.target.value, loginForm[key].type);
      let isValid = true;
      Object.keys(loginForm).forEach((k) => {
        isValid = isValid && (k === key ? valid : loginForm[k].valid);
      });
      setLoginForm({
        ...loginForm,
        [key]: {
          ...loginForm[key],
          valid,
          value: event.target.value,
          touched: true,
        },
      });
      setIsValid(isValid);
    } else {
      if (!registerForm[key]) return;
      const valid = isValueValid(event.target.value, registerForm[key].type);
      let isValid = true;
      Object.keys(registerForm).forEach((k) => {
        isValid = isValid && (k === key ? valid : registerForm[k].valid);
      });
      setRegisterForm({
        ...registerForm,
        [key]: {
          ...registerForm[key],
          valid,
          value: event.target.value,
          touched: true,
        },
      });
      setIsValid(isValid);
    }
  };

  const toggleAuthenticationType = () => {
    if (props.show) return;
    setIsLogin(!isLogin);
    setLoginForm(initialLoginForm);
    setRegisterForm(initialRegisterForm);
    setIsValid(false);
    setErrorMessage('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let error;
    setIsLoading(true);
    if (isLogin) {
      error = await login({
        email: loginForm.email.value,
        password: loginForm.password.value,
      });
    } else {
      const credentials: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: UserRole;
        worksFor?: string;
      } = {
        firstName: registerForm.firstName.value,
        lastName: registerForm.lastName.value,
        email: registerForm.email.value,
        password: registerForm.password.value,
        role: props.role,
      };
      if (props.role === 'employee') {
        credentials.worksFor = user.email;
      }
      error = await register(credentials);
    }
    setIsLoading(false);

    if (error && !props.hideErrorMessage) {
      setIsLoading(false);
      if (error.code.includes('user-not-found'))
        setErrorMessage('Incorrect Username or Password.');
      else setErrorMessage('Something Went Wrong. Please Try again Later.');
    }
  };

  const form = isLogin ? loginForm : registerForm;
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
            {Object.keys(form).map((key) => (
              <TextField
                className={classes['text-field']}
                fullWidth
                focused
                key={key}
                variant='filled'
                type={form[key].type}
                label={form[key].label}
                placeholder={form[key].placeholder}
                value={form[key].value}
                color={
                  form[key].valid || !form[key].touched ? 'primary' : 'warning'
                }
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
              {isLogin ? 'Login' : 'Register'}
            </LoadingButton>
          </form>

          {!props.show &&
            (isLogin ? (
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text)',
                  gap: '1rem',
                }}
              >
                {"Don't Have an Account? "}
                <Button
                  variant='text'
                  color='primary'
                  sx={{ textTransform: 'none' }}
                  onClick={toggleAuthenticationType}
                >
                  {'Register'}
                </Button>
              </Typography>
            ) : (
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text)',
                  gap: '1rem',
                }}
              >
                {'Have an Account?'}
                <Button
                  variant='text'
                  color='primary'
                  sx={{ textTransform: 'none' }}
                  onClick={toggleAuthenticationType}
                >
                  {'Login'}
                </Button>
              </Typography>
            ))}
        </CardContent>
      </Card>
      <Backdrop open={isLoading} />
    </>
  );
};

export default AuthenticationCard;
