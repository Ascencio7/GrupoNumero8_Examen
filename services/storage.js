// El archivo storage.js define funciones para interactuar con el almacenamiento local
// de AsyncStorage. Así se puede guardar y recuperar sesiones y preferencias de tema.


import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'avasa_session';
const THEME_KEY = 'avasa_theme';

export const saveSession = async (session) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = async () => {
  const rawSession = await AsyncStorage.getItem(SESSION_KEY);
  if (!rawSession) return null;
  return JSON.parse(rawSession);
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const saveTheme = async (darkMode) => {
  await AsyncStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
};

export const getTheme = async () => (await AsyncStorage.getItem(THEME_KEY)) !== 'light';
