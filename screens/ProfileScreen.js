// El archivo ProfileScreen.js define la pantalla de perfil de la app


// Se importan las bibliotecas y componentes necesarios
import React from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../services/theme';
import ControlLogo from '../components/ControlLogo';


// Se define la pantalla del perfil
const ProfileScreen = ({ session, darkMode, onThemeChange, onLogout }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.top);
  const isAdmin = session?.role === 'admin';


  // Se confirma el cierre de sesión
  const confirmLogout = () => Alert.alert(
    'Cerrar sesión',
    '¿Deseas cerrar tu sesión de AVASA?',
    [
      { text: 'Seguir aquí', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: onLogout },
    ],
  );


  // Retorna la pantalla
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Text style={styles.brandTitle}>AVASA</Text>
        <ControlLogo width={42} height={42} style={styles.headerLogo} />
      </View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name={isAdmin ? 'shield-checkmark' : 'person'} size={30} color="#fff" />
        </View>
        <Text style={styles.name}>{session?.userName || 'Jugador'}</Text>
        <Text style={styles.email}>{session?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{isAdmin ? 'ADMINISTRADOR' : 'CLIENTE'}</Text>
        </View>
      </View>

      <View style={styles.settings}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.row}>
          <View style={styles.themeIcon}><Ionicons name={darkMode ? 'moon' : 'sunny'} size={20} color={theme.accent} /></View>
          <View style={styles.preference}>
            <Text style={styles.preferenceTitle}>Tema oscuro</Text>
            <Text style={styles.muted}>{darkMode ? 'Cómodo para jugar de noche' : 'Claro y fácil de leer'}</Text>
          </View>
          <Switch value={darkMode} onValueChange={onThemeChange} trackColor={{ true: theme.accent }} />
        </View>
      </View>

      <View style={styles.about}>
        <Text style={styles.sectionTitle}>AVASA</Text>
        <Text style={styles.muted}>AVASA · Segundo Examen Práctico DAMA</Text>
        <Text style={styles.muted}>Compras y partidas disponibles en modo demostración.</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={19} color={theme.danger} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, topInset) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background, 
    paddingHorizontal: 18, 
    paddingTop: topInset + 18, 
    paddingBottom: 18 
  },

  brandRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },

  brandTitle: { 
    color: theme.text, 
    fontSize: 22, 
    fontWeight: '900', 
    letterSpacing: 2 
  },

  headerLogo: { 
    borderRadius: 8 
  },

  profileCard: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 20, 
    padding: 22, 
    alignItems: 'center' 
  },

  avatar: { 
    width: 76, 
    height: 76, 
    borderRadius: 25, 
    backgroundColor: theme.accentStrong, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  
  name: { 
    color: theme.text, 
    fontSize: 24, 
    fontWeight: '900' 
  },

  email: { 
    color: theme.muted, 
    fontSize: 13, 
    marginTop: 4 
  },

  roleBadge: { 
    backgroundColor: theme.accentSoft, 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    marginTop: 12 
  },

  roleText: { 
    color: theme.accent, 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 1 },

  settings: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 17, 
    padding: 16, 
    marginTop: 14 
  },

  sectionTitle: { 
    color: theme.text, 
    fontSize: 16, 
    fontWeight: '900', 
    marginBottom: 12 
  },

  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  themeIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 13, 
    backgroundColor: theme.accentSoft, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 11 
  },

  preference: { 
    flex: 1 
  },

  preferenceTitle: { 
    color: theme.text, 
    fontSize: 14, 
    fontWeight: '800' 
  },

  muted: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 4 
  },

  about: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 17, 
    padding: 16, 
    marginTop: 14 
  },

  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    borderWidth: 1, 
    borderColor: theme.danger, 
    borderRadius: 12, 
    padding: 13, 
    marginTop: 17 
  },
  
  logoutText: { 
    color: theme.danger, 
    fontWeight: '900' 
  },
  
});


// Se exporta el componente
export default ProfileScreen;