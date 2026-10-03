// El archivo AdminGamesScreen.js define las pantallas del administrador de la aplicación


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteGame, getGames, updateGame } from '../services/database';
import { useAppTheme } from '../services/theme';
import ControlLogo from '../components/ControlLogo';
import GameFilters from '../components/GameFilters';
import { filterGames } from '../services/gameFilters';


// Se define el componente que gestionará el admin
const AdminGamesScreen = ({ navigation }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.top);
  const [games, setGames] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const filteredGames = useMemo(
    () => filterGames(games, { name: nameFilter, minPrice: minPriceFilter, maxPrice: maxPriceFilter }),
    [games, nameFilter, minPriceFilter, maxPriceFilter],
  );

  // Se carga la lista de juegos
  const load = useCallback(() => setGames(getGames()), []);
  useFocusEffect(useCallback(() => load(), [load]));


  // Se actualiza el juego por la promoción del 20% de descuento
  const togglePromotion = (game) => {
    const promotion = Number(game.promotion) > 0 ? 0 : 20;
    updateGame(game.id, { ...game, promotion });
    load();
  };


  // Se confirma la eliminación del juego del catálogo de la app
  const confirmDelete = (game) => Alert.alert(
    'Eliminar juego',
    `¿Eliminar "${game.title}" del catálogo?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          try {
            deleteGame(game.id);
            load();
          } catch (error) {
            Alert.alert('No se pudo eliminar', error.message);
          }
        },
      },
    ],
  );


  // Retorna los filtros de los juegos
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.brand}>AVASA</Text>
          <Text style={styles.heading}>Gestionar juegos</Text>
          <Text style={styles.muted}>Catálogo AVASA · {filteredGames.length} de {games.length} juegos</Text>
        </View>
        <View style={styles.headerActions}>
          <ControlLogo width={42} height={42} style={styles.headerLogo} />
          <Pressable style={styles.addButton} onPress={() => navigation.getParent()?.navigate('DataEntryScreen')}>
            <Ionicons name="add" size={21} color="#fff" />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <GameFilters
            name={nameFilter}
            onNameChange={setNameFilter}
            minPrice={minPriceFilter}
            onMinPriceChange={setMinPriceFilter}
            maxPrice={maxPriceFilter}
            onMaxPriceChange={setMaxPriceFilter}
            onClear={() => {
              setNameFilter('');
              setMinPriceFilter('');
              setMaxPriceFilter('');
            }}
          />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No hay juegos que coincidan con los filtros.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=400&q=80' }} style={styles.image} />
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.muted}>{item.genre} · ${Number(item.price).toFixed(2)}</Text>
              <View style={styles.promoRow}>
                <Text style={styles.promoText}>Promoción 20%</Text>
                <Switch value={Number(item.promotion) > 0} onValueChange={() => togglePromotion(item)} trackColor={{ true: theme.accent }} />
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => navigation.getParent()?.navigate('DataEntryScreen', { game: item })} accessibilityLabel={`Editar ${item.title}`}>
                <Ionicons name="create-outline" size={22} color={theme.accent} />
              </Pressable>
              <Pressable onPress={() => confirmDelete(item)} accessibilityLabel={`Eliminar ${item.title}`}>
                <Ionicons name="trash-outline" size={22} color={theme.danger} />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, topInset) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background },
  
  headingRow: { 
    paddingHorizontal: 17, 
    paddingTop: topInset + 17, 
    paddingBottom: 17, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' },
  
  heading: { 
    color: theme.text, 
    fontSize: 23, 
    fontWeight: '900' },

  brand: { 
    color: theme.accent, 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 1.5, 
    marginBottom: 2 },
    
  muted: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 4 },

  headerActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 9 },
  
  headerLogo: { 
    borderRadius: 8 },

  addButton: { 
    width: 42, 
    height: 42, 
    borderRadius: 13, 
    backgroundColor: theme.accentStrong, 
    alignItems: 'center', 
    justifyContent: 'center' },

  list: { 
    paddingHorizontal: 14, 
    paddingBottom: 20 },

  emptyText: { 
    color: theme.muted, 
    textAlign: 'center', 
    padding: 20 },

  card: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 10, 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center' },

  image: { 
    width: 62, 
    height: 62, 
    borderRadius: 10, 
    backgroundColor: theme.accentSoft },

  gameInfo: { 
    flex: 1, 
    marginHorizontal: 10 },

  gameTitle: { 
    color: theme.text, 
    fontSize: 14, 
    fontWeight: '800' },

  promoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 7 },

  promoText: { 
    color: theme.muted, 
    fontSize: 11 },

  actions: { 
    gap: 15, 
    paddingHorizontal: 4 },

});


// Se exporta el componente
export default AdminGamesScreen;