// El archivo GameFormScreen.js define la pantalla de formulario de juego


// Se importan las bibliotecas y componentes necesarios
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addGame, updateGame } from '../services/database';
import { useAppTheme } from '../services/theme';


// Se define la pantalla vacía del formulario
const emptyForm = { title: '', genre: '', price: '', rating: '4.5', release: '', description: '', image: '', promotion: 0 };


// Se define la pantalla del formulario
const GameFormScreen = ({ route, navigation, session }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.bottom);
  const game = route.params?.game;
  const scrollRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [showDatePicker, setShowDatePicker] = useState(false);


  // Se verifica si el usuario es el administrador
  useEffect(() => {
    if (session?.role !== 'admin') {
      Alert.alert('Acceso exclusivo', 'Solo administración puede gestionar el catálogo.');
      navigation.goBack();
      return;
    }

    // Se inicializa el formulario
    setForm(game ? {
      title: game.title || '',
      genre: game.genre || '',
      price: String(game.price ?? ''),
      rating: String(game.rating ?? '4.5'),
      release: game.release || '',
      description: game.description || '',
      image: game.image || '',
      promotion: Number(game.promotion || 0),
    } : emptyForm);
  }, [game, navigation, session?.role]);

  // Se verifica si se ha seleccionado la categoria del juego
  useEffect(() => {
    const selectedCategory = route.params?.selectedCategory;
    if (selectedCategory) {
      setForm((current) => ({ ...current, genre: selectedCategory }));
    }
  }, [route.params?.selectedCategory]);

  // Se define las funciones para manejar el formulario
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  // Se define las funciones para manejar la selección de la fecha del juego
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(form.release)
    ? new Date(`${form.release}T12:00:00`)
    : new Date();

  // Se define para manejar la selección de la fecha del juego 
  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setField('release', `${year}-${month}-${day}`);
    }
  };

  // Se define la funcionalidad para guardar el juego
  const save = () => {
    const price = Number(form.price);
    const rating = Number(form.rating);
    const promotion = Number(form.promotion);
    if (!form.title.trim() || !form.genre.trim() || !form.description.trim() || !form.release.trim()) {
      Alert.alert('Campos incompletos', 'Completa título, género, lanzamiento y descripción.');
      return;
    }

    // Se verifica que los datos sean validos
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(rating) || rating < 0 || rating > 5 || ![0, 10, 20, 30, 40, 50, 60, 70, 80, 90].includes(promotion)) {
      Alert.alert('Datos no válidos', 'Verifica el precio, la calificación (0 a 5) y la promoción (0 a 90%).');
      return;
    }
    const payload = {
      title: form.title.trim(),
      genre: form.genre.trim(),
      price,
      rating,
      release: form.release.trim(),
      description: form.description.trim(),
      image: form.image.trim() || null,
      promotion,
    };
    try {
      if (game) updateGame(game.id, payload);
      else addGame(payload);
      navigation.goBack();
    } catch (error) {
      Alert.alert('No se pudo guardar', error.message);
    }
  };


  // Retorna la pantalla
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 64 : 0}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <Text style={styles.heading}>{game ? 'Editar juego' : 'Nuevo juego'}</Text>
        <Text style={styles.subtitle}>Solo administración puede modificar el catálogo.</Text>
        <Field label="Título" value={form.title} onChangeText={(value) => setField('title', value)} styles={styles} theme={theme} />
        <Text style={styles.label}>Categoría</Text>
        <Pressable
          style={styles.categoryButton}
          onPress={() => navigation.navigate('GameCategoriesScreen', { selectedCategory: form.genre })}
        >
          <Text style={form.genre ? styles.categoryValue : styles.categoryPlaceholder}>
            {form.genre || 'Seleccionar categoría'}
          </Text>
          <Text style={styles.categoryAction}>Ver categorías ›</Text>
        </Pressable>
        <View style={styles.twoColumns}>
          <Field label="Precio base ($)" value={form.price} onChangeText={(value) => setField('price', value)} keyboardType="decimal-pad" styles={styles} theme={theme} />
          <Field label="Calificación / 5" value={form.rating} onChangeText={(value) => setField('rating', value)} keyboardType="decimal-pad" styles={styles} theme={theme} />
        </View>
        <Text style={styles.label}>Fecha de lanzamiento</Text>
        <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={form.release ? styles.dateValue : styles.datePlaceholder}>
            {form.release || 'Seleccionar fecha'}
          </Text>
          <Text style={styles.calendarIcon}>▦</Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
        <Field label="Foto (URL opcional)" value={form.image} onChangeText={(value) => setField('image', value)} placeholder="https://..." autoCapitalize="none" styles={styles} theme={theme} />
        {form.image.trim() ? <Image source={{ uri: form.image.trim() }} style={styles.preview} /> : null}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={form.description}
          onChangeText={(value) => setField('description', value)}
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Describe el juego..."
          placeholderTextColor={theme.muted}
          onFocus={() => {
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
          }}
        />
        <View style={styles.promotionRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Promoción del 20%</Text>
            <Text style={styles.muted}>El cliente verá el precio rebajado en la tienda.</Text>
          </View>
          <Switch value={Number(form.promotion) > 0} onValueChange={(value) => setField('promotion', value ? 20 : 0)} trackColor={{ true: theme.accent }} />
        </View>
        <Pressable style={styles.button} onPress={save}>
          <Text style={styles.buttonText}>{game ? 'Guardar cambios' : 'Agregar al catálogo'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


// Se define un campo del formulario del juego que funciona como un TextInput
const Field = ({ label, styles, theme, ...props }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput {...props} style={styles.input} placeholderTextColor={theme.muted} />
  </View>
);


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, bottomInset) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },

  content: { 
    padding: 18, paddingBottom: Math.max(bottomInset, 16) + 24 },

  heading: { 
    color: theme.text, 
    fontSize: 26, 
    fontWeight: '900' 
  },

  subtitle: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 4, 
    marginBottom: 20 
  },

  field: { 
    flex: 1, 
    marginBottom: 11 
  },

  label: { 
    color: theme.text, 
    fontSize: 13, 
    fontWeight: '800', 
    marginBottom: 7 
  },

  input: { 
    backgroundColor: theme.input, 
    borderWidth: 1, 
    borderColor: theme.border, 
    borderRadius: 11, 
    color: theme.text, 
    paddingHorizontal: 12, 
    paddingVertical: 11, 
    fontSize: 14, 
    minHeight: 45 
  },
  
  dateButton: { 
    minHeight: 46, 
    backgroundColor: theme.input, 
    borderWidth: 1, 
    borderColor: theme.border, 
    borderRadius: 11, 
    paddingHorizontal: 12, 
    marginBottom: 11, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  
  dateValue: { 
    color: theme.text, 
    fontSize: 14 
  },

  datePlaceholder: { 
    color: theme.muted, 
    fontSize: 14 
  },

  calendarIcon: { 
    color: theme.accent, 
    fontSize: 20, 
    fontWeight: '800' 
  },

  categoryButton: { 
    minHeight: 46, 
    backgroundColor: theme.input, 
    borderWidth: 1, 
    borderColor: theme.border, 
    borderRadius: 11, 
    paddingHorizontal: 12, 
    marginBottom: 11, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  
  categoryValue: { 
    color: theme.text, 
    fontSize: 14, 
    fontWeight: '700' 
  },

  categoryPlaceholder: { 
    color: theme.muted, 
    fontSize: 14 },

  categoryAction: { 
    color: theme.accent, 
    fontSize: 12, 
    fontWeight: '800' 
  },

  twoColumns: { 
    flexDirection: 'row', 
    gap: 12 
  },

  textArea: { 
    minHeight: 105, 
    textAlignVertical: 'top', 
    marginBottom: 15 
  },

  preview: { 
    height: 150, 
    width: '100%', 
    borderRadius: 13, 
    marginTop: 2, 
    marginBottom: 13, 
    backgroundColor: theme.accentSoft 
  },

  promotionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 13, 
    padding: 12, 
    marginTop: 2 
  },
  
  muted: { 
    color: theme.muted, 
    fontSize: 11 
  },

  button: { 
    backgroundColor: theme.accentStrong, 
    borderRadius: 12, 
    alignItems: 'center', 
    padding: 15, 
    marginTop: 18 
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: '900' 
  },

});


// Se exporta el componente
export default GameFormScreen;