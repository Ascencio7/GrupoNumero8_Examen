// El archivo PlayScreen.js define la pantalla de juego de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../services/theme';


// Se define la pantalla de juego
const PlayScreen = ({ route }) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const game = route.params?.game;
  const [playing, setPlaying] = useState(false);


  // Retorna la pantalla
  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Ionicons name="game-controller-outline" size={76} color={theme.accent} />
        <Text style={styles.title}>{playing ? 'Partida iniciada' : 'Preparado para jugar'}</Text>
        <Text style={styles.game}>{game?.title || 'Tu juego'}</Text>
        <Text style={styles.note}>Esta es una simulación visual. El juego no se descarga ni se ejecuta.</Text>
        <Pressable style={styles.button} onPress={() => setPlaying((current) => !current)}>
          <Ionicons name={playing ? 'stop' : 'play'} size={18} color="#fff" />
          <Text style={styles.buttonText}>{playing ? 'Finalizar simulación' : 'Iniciar simulación'}</Text>
        </Pressable>
      </View>
    </View>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background, 
    padding: 20, 
    justifyContent: 'center' 
  },

  screen: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 24, 
    padding: 26, 
    alignItems: 'center' 
  },

  title: { 
    color: theme.text, 
    fontSize: 23, 
    fontWeight: '900', 
    marginTop: 18, 
    textAlign: 'center' 
  },

  game: { 
    color: theme.accent, 
    fontSize: 17, 
    fontWeight: '800', 
    marginTop: 6 
  },

  note: { 
    color: theme.muted, 
    lineHeight: 19, 
    textAlign: 'center', 
    fontSize: 13, 
    marginTop: 14 
  },

  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: theme.accentStrong, 
    borderRadius: 12, 
    padding: 14, 
    width: '100%', 
    marginTop: 22 
  },
  
  buttonText: { 
    color: '#fff', 
    fontWeight: '800' 
  },
  
});


// Se exporta el componente
export default PlayScreen;