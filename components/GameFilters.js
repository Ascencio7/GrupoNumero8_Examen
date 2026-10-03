// El archivo GameFilters.js define el componente que filtra los juegos en las pantallas que lo usan

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../services/theme';


// Se define el componente con sus propiedades para controlar el filtro de los juegos
const GameFilters = ({
  name,
  onNameChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  onClear,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);


  // Retorna por medio de la búsqueda del nombre o precio del juego
  return (
    <View style={styles.container}>
      <View style={styles.nameInput}>
        <Ionicons name="search-outline" size={18} color={theme.muted} />
        <TextInput
          style={styles.searchText}
          value={name}
          onChangeText={onNameChange}
          placeholder="Filtrar por nombre"
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>
      <View style={styles.priceRow}>
        <TextInput
          style={styles.priceInput}
          value={minPrice}
          onChangeText={onMinPriceChange}
          placeholder="Precio mínimo"
          placeholderTextColor={theme.muted}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.priceInput}
          value={maxPrice}
          onChangeText={onMaxPriceChange}
          placeholder="Precio máximo"
          placeholderTextColor={theme.muted}
          keyboardType="decimal-pad"
        />
      </View>
      
      {/* Sirve para limpiar los filtros */}
      
      <Pressable
        style={styles.clearButton}
        onPress={onClear}
        accessibilityRole="button"
        accessibilityLabel="Limpiar filtros de juegos"
      >
        <Ionicons name="close-circle-outline" size={17} color={theme.accent} />
        <Text style={styles.clearText}>Limpiar filtros</Text>
      </Pressable>
    </View>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 11,
    marginBottom: 12,
  },
  nameInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    borderRadius: 10,
    paddingHorizontal: 11,
  },
  searchText: { flex: 1, color: theme.text, paddingVertical: 10 },
  priceRow: { flexDirection: 'row', gap: 9, marginTop: 9 },
  priceInput: {
    flex: 1,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    marginTop: 3,
  },
  clearText: { color: theme.accent, fontSize: 12, fontWeight: '800' },
});


// Se exporta el componente
export default GameFilters;