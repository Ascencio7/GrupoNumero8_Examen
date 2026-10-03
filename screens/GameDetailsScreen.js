// El archivo GameDetailsScreen.js define la pantalla de detalles de un juego


// Se importan las bibliotecas y componentes necesarios
import React, { useLayoutEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addToCart, getOwnedGames } from '../services/database';
import { useAppTheme } from '../services/theme';


// Se define el componente para la pantalla de los detalles del juego
const GameDetailsScreen = ({ route, navigation, session, onCartChange }) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const game = route.params?.game;
  const isAdmin = session?.role === 'admin';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: game?.title || 'Juego',
      headerRight: isAdmin
        ? () => (
            <Pressable onPress={() => navigation.navigate('DataEntryScreen', { game })} style={styles.headerButton}>
              <Ionicons name="create-outline" size={18} color={theme.text} />
              <Text style={styles.headerText}>Editar</Text>
            </Pressable>
          )
        : undefined,
    });
  }, [game, isAdmin, navigation, theme.text]);

  // Se define una función para agregar el juego al carrito
  const addGame = () => {
    const alreadyOwned = getOwnedGames(session.userId).some((owned) => owned.id === game.id);

    // Si el juego ya esta en la biblioteca no se podrá agregar de nuevo
    if (alreadyOwned) {
      Alert.alert('Ya tienes este juego', 'Este título ya está en tu biblioteca.');
      return;
    }

    // Se agrega el juego al carrito
    const result = addToCart(session.userId, game.id);
    if (result.added) {
      onCartChange?.();
      Alert.alert('Agregado al carrito', `${game.title} está listo para pagar.`);
      return;
    }

    // Si el juego ya estaba en el carrtio y si ya esta en la biblioteca no podrá agregar de nuevo
    Alert.alert(
      result.reason === 'owned' ? 'Ya tienes este juego' : 'Ya está en el carrito',
      result.reason === 'owned' ? 'Este título ya está en tu biblioteca.' : 'No es posible agregar el mismo juego dos veces.',
    );
  };

  // Si el juego no se pudo cargar mostrará el siguiente mensaje de error
  if (!game) {
    return <View style={styles.container}><Text style={styles.text}>No se pudo cargar el juego.</Text></View>;
  }

  // Se calcula el precio final
  const price = Number(game.price);
  const discount = Number(game.promotion || 0);
  const finalPrice = price * (100 - discount) / 100;


  // Se renderizan los detalles del juego
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: game.image || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80' }} style={styles.image} />
      <View style={styles.panel}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{game.title}</Text>
          {discount > 0 && <Text style={styles.discount}>-{discount}%</Text>}
        </View>
        <Text style={styles.genre}>{game.genre} · ★ {game.rating}</Text>
        <View style={styles.priceRow}>
          {discount > 0 && <Text style={styles.oldPrice}>${price.toFixed(2)}</Text>}
          <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.muted}>Lanzamiento</Text>
          <Text style={styles.text}>{game.release}</Text>
        </View>
        <Text style={styles.description}>{game.description}</Text>
        {isAdmin ? (
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('DataEntryScreen', { game })}>
            <Text style={styles.buttonText}>Editar información</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={addGame}>
            <Ionicons name="cart-outline" size={19} color="#fff" />
            <Text style={styles.buttonText}>Agregar al carrito</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },

  content: { 
    padding: 16, 
    paddingBottom: 28 
  },

  image: { 
    width: '100%', 
    height: 230, 
    borderRadius: 19, 
    backgroundColor: theme.accentSoft, 
    marginBottom: 14 
  },

  panel: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 18, 
    padding: 18 
  },

  titleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: 10 
  },

  title: { 
    flex: 1, 
    color: theme.text, 
    fontSize: 27, 
    fontWeight: '900' 
  },

  discount: { 
    backgroundColor: theme.success, 
    color: '#fff', 
    overflow: 'hidden', 
    paddingHorizontal: 9, 
    paddingVertical: 5, 
    borderRadius: 8, 
    fontWeight: '900' 
  },
  
  genre: { 
    color: theme.accent, 
    fontWeight: '700', 
    marginTop: 7, 
    marginBottom: 12 
  },

  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 9, 
    marginBottom: 15 
  },

  oldPrice: { 
    color: theme.muted, 
    textDecorationLine: 'line-through', 
    fontSize: 15 
  },

  price: { 
    color: theme.success, 
    fontSize: 23, 
    fontWeight: '900' 
  },

  metaRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: theme.border 
  },
  
  text: { 
    color: theme.text 
  },

  muted: { 
    color: theme.muted, 
    fontSize: 13 
  },

  description: { 
    color: theme.text, 
    fontSize: 15, 
    lineHeight: 23, 
    marginTop: 16, 
    marginBottom: 8 
  },

  primaryButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: theme.accentStrong, 
    borderRadius: 12, 
    padding: 15, 
    marginTop: 18 
  },
  
  buttonText: { 
    color: '#fff', 
    fontWeight: '900', 
    fontSize: 15 
  },

  headerButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    marginRight: 8 
  },

  headerText: { 
    color: theme.text, 
    fontWeight: '800' 
  },

});


// Se exporta el componente
export default GameDetailsScreen;