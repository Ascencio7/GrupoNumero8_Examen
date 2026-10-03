// El archivo BrandLogo.js define el componente que muestra el logo de la aplicación.

import React from 'react';
import { Image, StyleSheet } from 'react-native';


// El componente BrandLogo se define con un parámetro width y height para controlar el tamaño del logo
const BrandLogo = ({ width = 220, height = 195, style }) => (
  <Image
    source={require('../logoImage/logo.png')}
    style={[styles.logo, { width, height }, style]}
    resizeMode="contain"
    accessibilityLabel="AVASA, tu próxima partida empieza aquí"
  />
);


// Se define un estilo para mejorar la apariencia visual del logo
const styles = StyleSheet.create({
  logo: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});


// Se exporta el componente
export default BrandLogo;