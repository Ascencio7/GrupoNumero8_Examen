// El archivo ListScreen.js define la pantalla de la biblioteca de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getOwnedGames } from '../services/database';
import { useAppTheme } from '../services/theme';
import ControlLogo from '../components/ControlLogo';


// Se define el componente para la lista de los juegos
const ListScreen = ({ navigation, session }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.top);
  const [games, setGames] = useState([]);
  const load = useCallback(() => setGames(getOwnedGames(session.userId)), [session.userId]);
  useFocusEffect(useCallback(() => load(), [load]));


  // Retorna la pantalla
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Mi biblioteca</Text>
        <ControlLogo width={42} height={42} style={styles.headerLogo} />
      </View>
      <FlatList
        data={games}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={games.length ? styles.list : styles.emptyList}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={48} color={theme.muted} />
            <Text style={styles.emptyTitle}>Todavía no tienes juegos</Text>
            <Text style={styles.muted}>Tus compras aparecerán aquí listas para jugar.</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('StoreTab')}>
              <Text style={styles.buttonText}>Explorar tienda</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=400&q=80' }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.gameTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.muted}>{item.genre} · adquirido {new Date(item.purchased_at).toLocaleDateString()}</Text>
            </View>
            <Pressable style={styles.playButton} onPress={() => navigation.getParent()?.navigate('PlayScreen', { game: item })}>
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.playText}>Jugar</Text>
            </Pressable>
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
    paddingBottom: 24 
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
    fontSize: 12, 
    lineHeight: 18 
  },

  button: { 
    backgroundColor: theme.accentStrong, 
    paddingVertical: 12, 
    paddingHorizontal: 18, 
    borderRadius: 11, 
    marginTop: 18 
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: '800' 
  },

  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 10, 
    marginBottom: 10 
  },
  
  image: { 
    width: 68, 
    height: 68, 
    borderRadius: 10, 
    backgroundColor: theme.accentSoft 
  },

  info: { 
    flex: 1, 
    marginHorizontal: 11, 
    minWidth: 0 
  },

  gameTitle: { 
    color: theme.text, 
    fontSize: 15, 
    fontWeight: '800', 
    marginBottom: 4 
  },

  playButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: theme.accentStrong, 
    borderRadius: 9, 
    paddingVertical: 9, 
    paddingHorizontal: 10 
  },
  
  playText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '800' 
  },

});


// Se exporta el componente
export default ListScreen;