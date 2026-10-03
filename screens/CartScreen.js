// El archivo CartScreen.js define la pantalla del carrito de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCart, removeFromCart } from '../services/database';
import { useAppTheme } from '../services/theme';
import ControlLogo from '../components/ControlLogo';


// Se define el componente para la pantalla del carrito
const CartScreen = ({ navigation, session, onCartChange }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.top);
  const [items, setItems] = useState([]);
  const load = useCallback(() => setItems(getCart(session.userId)), [session.userId]);
  useFocusEffect(useCallback(() => load(), [load]));
  const total = items.reduce((sum, item) => sum + Number(item.final_price), 0);

  // Confirmar la eliminación del juego o juegos del carrito de compras
  const confirmRemove = (item) => {
    Alert.alert('Quitar del carrito', `¿Quieres quitar "${item.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: () => { removeFromCart(session.userId, item.id); load(); onCartChange?.(); } },
    ]);
  };


  // Retorna la lista de los juegos en el carrito
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Tu carrito</Text>
        <ControlLogo width={42} height={42} style={styles.headerLogo} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={items.length ? styles.list : styles.emptyList}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={48} color={theme.muted} />
            <Text style={styles.emptyTitle}>Aún no agregas juegos</Text>
            <Text style={styles.muted}>Explora el catálogo y guarda aquí tus próximos juegos.</Text>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('StoreTab')}>
              <Text style={styles.secondaryText}>Ir a la tienda</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=400&q=80' }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.muted}>{item.genre}</Text>
              <Text style={styles.price}>${Number(item.final_price).toFixed(2)}</Text>
            </View>
            <Pressable accessibilityLabel={`Quitar ${item.title}`} onPress={() => confirmRemove(item)} hitSlop={10}>
              <Ionicons name="trash-outline" size={21} color={theme.danger} />
            </Pressable>
          </View>
        )}
        ListFooterComponent={items.length > 0 ? (
          <View style={styles.summary}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.total}>${total.toFixed(2)}</Text>
            <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('CheckoutScreen')}>
              <Text style={styles.primaryText}>Continuar al pago</Text>
            </Pressable>
            <Text style={styles.note}>Pago simulado para fines académicos.</Text>
          </View>
        ) : null}
      />
    </View>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, topInset) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background, 
    paddingTop: topInset + 18 
  },

  heading: { 
    color: theme.text, 
    fontSize: 27, 
    fontWeight: '900', 
    paddingHorizontal: 18, 
    paddingBottom: 14 
  },

  headingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingRight: 18 
  },

  headerLogo: { 
    borderRadius: 8 
  },

  list: { 
    paddingHorizontal: 16, 
    paddingBottom: 28 
  },

  emptyList: { 
    flexGrow: 1 
  },

  empty: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 28 
  },

  emptyTitle: { 
    color: theme.text, 
    fontSize: 19, 
    fontWeight: '800', 
    marginTop: 14, 
    marginBottom: 7 
  },

  muted: { 
    color: theme.muted, 
    fontSize: 13, 
    lineHeight: 19 
  },

  secondaryButton: { 
    backgroundColor: theme.accentSoft, 
    paddingVertical: 12, 
    paddingHorizontal: 18, 
    borderRadius: 11, 
    marginTop: 18 
  },

  secondaryText: { 
    color: theme.accent, 
    fontWeight: '800' 
  },

  item: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  
  image: { 
    width: 70, 
    height: 70, 
    borderRadius: 10, 
    backgroundColor: theme.accentSoft 
  },

  info: { 
    flex: 1, 
    marginHorizontal: 12 
  },

  itemTitle: { 
    color: theme.text, 
    fontSize: 15, 
    fontWeight: '800', 
    marginBottom: 3 
  },

  price: { 
    color: theme.success, 
    fontWeight: '900', 
    marginTop: 6 
  },

  summary: { 
    padding: 18, 
    borderRadius: 16, 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    marginTop: 12 
  },

  totalLabel: { 
    color: theme.muted, 
    fontSize: 14 
  },

  total: { 
    color: theme.text, 
    fontWeight: '900', 
    fontSize: 28, 
    marginTop: 3 
  },

  primaryButton: { 
    backgroundColor: theme.accentStrong, 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 15 },

  primaryText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: '800' 
  },

  note: { 
    color: theme.muted, 
    textAlign: 'center', 
    fontSize: 11, 
    marginTop: 10 
  },

});


// Se exporta el componente
export default CartScreen;