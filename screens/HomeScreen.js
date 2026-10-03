// El archivo HomeScreen.js define la pantalla de inicio de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGames } from '../services/database';
import { useAppTheme } from '../services/theme';
import ControlLogo from '../components/ControlLogo';
import GameFilters from '../components/GameFilters';
import { filterGames } from '../services/gameFilters';


// Se define una función para formatear el precio con 2 decimales
const formatPrice = (price) => `$${Number(price).toFixed(2)}`;


// Se define el componente para la pantalla de inicio
const HomeScreen = ({ navigation, session }) => {
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

  const loadGames = useCallback(() => setGames(getGames()), []);
  useFocusEffect(useCallback(() => loadGames(), [loadGames]));


  // Retorna la pantalla
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topLine}>
        <View>
          <Text style={styles.eyebrow}>TIENDA DIGITAL</Text>
          <ControlLogo width={62} height={62} style={styles.headerLogo} />
        </View>
        <View style={styles.avatar}>
          <Ionicons name={session?.role === 'admin' ? 'shield-checkmark' : 'game-controller'} size={21} color={theme.accent} />
        </View>
      </View>
      <Text style={styles.greeting}>¡Hola, {session?.userName || 'Jugador'}!</Text>

      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="flash" size={24} color="#fff" /></View>
        <Text style={styles.heroTitle}>Juega a tu manera</Text>
        <Text style={styles.heroText}>Explora novedades, encuentra ofertas y arma tu próxima aventura.</Text>
      </View>

      {filteredGames.some((game) => Number(game.promotion) > 0) && (
        <>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Ofertas especiales</Text>
            <Text style={styles.offerTag}>POR TIEMPO LIMITADO</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {filteredGames.filter((game) => Number(game.promotion) > 0).map((game) => {
              const salePrice = Number(game.price) * (100 - Number(game.promotion)) / 100;
              return (
                <Pressable key={`sale-${game.id}`} style={styles.offerCard} onPress={() => navigation.navigate('GameDetails', { game })}>
                  <Image source={{ uri: game.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80' }} style={styles.image} resizeMode="contain" />
                  <View style={styles.discount}><Text style={styles.discountText}>-{game.promotion}%</Text></View>
                  <View style={styles.cardBody}>
                    <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
                    <Text style={styles.meta}>{game.genre}</Text>
                    <View style={styles.priceLine}>
                      <Text style={styles.oldPrice}>{formatPrice(game.price)}</Text>
                      <Text style={styles.price}>{formatPrice(salePrice)}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Catálogo</Text>
        <Text style={styles.count}>{filteredGames.length} de {games.length} juegos</Text>
      </View>
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
      {filteredGames.map((game) => {
        const salePrice = Number(game.price) * (100 - Number(game.promotion || 0)) / 100;
        return (
          <Pressable key={game.id} style={styles.listCard} onPress={() => navigation.navigate('GameDetails', { game })}>
            <Image source={{ uri: game.image || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=600&q=80' }} style={styles.thumb} />
            <View style={styles.listInfo}>
              <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
              <Text style={styles.meta}>{game.genre} · ★ {game.rating}</Text>
              {Number(game.promotion) > 0 && <Text style={styles.saleLabel}>-{game.promotion}% de descuento</Text>}
            </View>
            <View style={styles.priceArea}>
              {Number(game.promotion) > 0 && <Text style={styles.oldPrice}>{formatPrice(game.price)}</Text>}
              <Text style={styles.price}>{formatPrice(salePrice)}</Text>
            </View>
          </Pressable>
        );
      })}
      {filteredGames.length === 0 && (
        <Text style={styles.meta}>
          {games.length === 0 ? 'No hay juegos disponibles todavía.' : 'No hay juegos que coincidan con los filtros.'}
        </Text>
      )}
    </ScrollView>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, topInset) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },

  content: { 
    paddingHorizontal: 18, 
    paddingTop: topInset + 18, 
    paddingBottom: 32 
  },

  topLine: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  eyebrow: { 
    color: theme.accent, 
    fontSize: 11, 
    fontWeight: '900', 
    letterSpacing: 1.5 
  },

  headerLogo: { 
    borderRadius: 8, 
    marginTop: 3 
  },

  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 15, 
    backgroundColor: theme.accentSoft, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  greeting: { 
    color: theme.muted, 
    fontSize: 14, 
    marginTop: 4, 
    marginBottom: 18 
  },

  hero: { 
    backgroundColor: theme.accentStrong, 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 24 
  },

  heroIcon: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    backgroundColor: '#ffffff30', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },

  heroTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '900' 
  },

  heroText: { 
    color: '#e6f3ff', 
    fontSize: 14, 
    lineHeight: 21, 
    marginTop: 5, 
    maxWidth: 330 
  },

  sectionHeading: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12, 
    marginTop: 2 
  },

  sectionTitle: { 
    color: theme.text, 
    fontSize: 20, 
    fontWeight: '800' 
  },

  offerTag: { 
    color: theme.success, 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 0.5 
  },

  count: { 
    color: theme.muted, 
    fontSize: 12 
  },

  carousel: { 
    marginBottom: 22 
  },

  offerCard: { 
    width: 230, 
    backgroundColor: theme.surface, 
    borderRadius: 17, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: theme.border, 
    marginRight: 12 
  },
  
  image: { 
    width: '100%', 
    height: 126, 
    backgroundColor: theme.surface 
  },

  discount: { 
    position: 'absolute', 
    top: 10, right: 10, 
    borderRadius: 8, 
    backgroundColor: theme.success, 
    paddingHorizontal: 9, 
    paddingVertical: 5 
  },

  discountText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '900' 
  },

  cardBody: { 
    padding: 12 
  },

  gameTitle: { 
    color: theme.text, 
    fontSize: 15, 
    fontWeight: '800' 
  },

  meta: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 5 
  },

  priceLine: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 9 
  },

  oldPrice: { 
    color: theme.muted, 
    textDecorationLine: 'line-through', 
    fontSize: 12 
  },

  price: { 
    color: theme.success, 
    fontSize: 15, 
    fontWeight: '900' 
  },

  listCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.surface, 
    borderRadius: 15, 
    padding: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: theme.border 
  },
  
  thumb: { 
    width: 62, 
    height: 62, 
    borderRadius: 11, 
    backgroundColor: theme.accentSoft 
  },

  listInfo: { 
    flex: 1, 
    minWidth: 0, 
    marginLeft: 12, 
    marginRight: 8 
  },

  saleLabel: { 
    color: theme.success, 
    fontSize: 11, 
    marginTop: 4, 
    fontWeight: '700' 
  },

  priceArea: { 
    alignItems: 'flex-end' 
  },

});


// Se exporta el componente
export default HomeScreen;