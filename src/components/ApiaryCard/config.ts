export const initialApiaryForm = {
  name: {
    type: 'text',
    label: 'Name',
    placeholder: 'The Shire',
    value: '',
    valid: false,
    touched: false,
  },
  description: {
    type: 'text',
    label: 'Description',
    placeholder: '...',
    value: '',
    valid: true,
    touched: false,
    multiline: true,
    noValidate: true,
  },
  latitude: {
    type: 'number',
    label: 'Latitude',
    placeholder: '0',
    value: 0,
    valid: true,
    disabled: false,
    noValidate: true,
  },
  longitude: {
    type: 'number',
    label: 'Longitude',
    placeholder: '0',
    value: 0,
    valid: true,
    disabled: false,
    noValidate: true,
  },
};
