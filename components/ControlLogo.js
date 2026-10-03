// El archivo ControlLogo.js es para mostrar el logo en la pantalla de control de la app.

import React from 'react';
import { Image, StyleSheet } from 'react-native';


// El componente define un parámetro width y height para controlar el tamaño del logo
const ControlLogo = ({ width = 76, height = 76, style }) => (
  <Image
    source={require('../logoImage/logoControl.png')}
    style={[styles.logo, { width, height }, style]}
    resizeMode="contain"
    accessibilityLabel="AVASA"
  />
);


// Se define un estilo para mejorar la apariencia visual del logo en el panel de control
const styles = StyleSheet.create({
  logo: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});


// Se exporta el componente
export default ControlLogo;