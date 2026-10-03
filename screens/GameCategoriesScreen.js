// El archivo GameCategoriesScreen.js define la pantalla de categorías de la app


// Se importan las bibliotecas y componentes necesarios
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../services/theme';
import { GAME_CATEGORIES } from '../services/gameCategories';


// Se define el componente para la pantalla que tendra las categorías de los juegos
const GameCategoriesScreen = ({ navigation, route }) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const selectedCategory = route.params?.selectedCategory;

  // Se define una función para manejar la selección de una categoría
  const selectCategory = (category) => {
    navigation.navigate({
      name: 'DataEntryScreen',
      params: { selectedCategory: category },
      merge: true,
    });
  };


  // Retorna la pantalla
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Categorías de videojuegos</Text>
      <Text style={styles.subtitle}>Selecciona una categoría para clasificar el juego en el catálogo.</Text>
      <View style={styles.list}>
        {GAME_CATEGORIES.map(({ name, icon }) => {
          const selected = selectedCategory === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => selectCategory(name)}
              style={[styles.category, selected && styles.selectedCategory]}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={icon} size={21} color={theme.accent} />
              </View>
              <Text style={styles.categoryName}>{name}</Text>
              {selected
                ? <Ionicons name="checkmark-circle" size={22} color={theme.success} />
                : <Ionicons name="chevron-forward" size={20} color={theme.muted} />}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};


// Se definen estilos para mejorar la apariciencia visual
const makeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 18, paddingBottom: 30 },
  heading: { color: theme.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: theme.muted, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 18 },
  list: { gap: 9 },
  category: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 14,
  },
  selectedCategory: { borderColor: theme.accent, backgroundColor: theme.accentSoft },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: { flex: 1, color: theme.text, fontSize: 15, fontWeight: '800' },
});

export default GameCategoriesScreen;
