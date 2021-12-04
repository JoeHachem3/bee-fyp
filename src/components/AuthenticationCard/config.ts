export const initialRegisterForm = {
  firstName: {
    type: 'text',
    label: 'First Name',
    placeholder: 'Frodo',
    value: '',
    valid: false,
    touched: false,
  },
  lastName: {
    type: 'text',
    label: 'Last Name',
    placeholder: 'Baggins',
    value: '',
    valid: false,
    touched: false,
  },
  email: {
    type: 'email',
    label: 'Email',
    placeholder: 'example@gmail.com',
    value: '',
    valid: false,
    touched: false,
  },
  // password: {
  //   type: 'password',
  //   label: 'Password',
  //   placeholder: '••••••••',
  //   value: '',
  //   valid: false,
  //   touched: false,
  // },
};

export const initialLoginForm = {
  email: {
    type: 'email',
    label: 'Email',
    placeholder: 'example@gmail.com',
    value: '',
    valid: false,
    touched: false,
  },
  password: {
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    value: '',
    valid: false,
    touched: false,
  },
};
