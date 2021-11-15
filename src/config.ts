import env from 'react-dotenv';

const config = {
  firebase: {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID,
  },
  openWeather: {
    key: env.OPEN_WEATHER_KEY,
  },
  googleMaps: {
    key: env.GOOGLE_MAPS_KEY,
  },
};

export default config;
