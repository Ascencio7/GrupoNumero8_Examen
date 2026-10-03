// El archivo LoginScreen.js define la pantalla de inicio de sesión de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../services/theme';
import BrandLogo from '../components/BrandLogo';


// Se define la pantalla de inicio de sesión
const LoginScreen = ({ onLogin, navigation }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = makeStyles(theme, insets.top, insets.bottom);


  // Se maneja el inicio de sesión para que sus datos sean correctos
  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Revisa tus datos', 'Ingresa tu nombre de usuario o correo y tu contraseña.');
      return;
    }

    setLoading(true);
    try {
      await onLogin(identifier.trim(), password);
    } catch (error) {
      Alert.alert('No se pudo iniciar sesión', error.message);
    } finally {
      setLoading(false);
    }
  };


  // Retorna la pantalla
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <BrandLogo width={220} height={195} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <Text style={styles.label}>Nombre de usuario o correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Usuario o correo"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoComplete="username"
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={theme.muted}
            secureTextEntry
            autoComplete="password"
          />
          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </Pressable>
          <Pressable style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>¿No tienes cuenta? Crear una cuenta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, topInset, bottomInset) =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.background 
    },

    content: { 
      flexGrow: 1, 
      justifyContent: 'center', 
      paddingHorizontal: 24, 
      paddingTop: topInset + 24, 
      paddingBottom: bottomInset + 24 
    },

    brand: { 
      alignItems: 'center', 
      marginBottom: 30 
    },

    card: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 22,
      padding: 22,
    },

    cardTitle: { 
      color: theme.text, 
      fontSize: 21, 
      fontWeight: '800', 
      marginBottom: 20 
    },

    label: { 
      color: theme.text, 
      fontSize: 14, 
      fontWeight: '700', 
      marginBottom: 8 
    },

    input: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      color: theme.text,
      paddingHorizontal: 14,
      paddingVertical: 13,
      fontSize: 16,
      marginBottom: 18,
    },

    button: {
      minHeight: 50,
      backgroundColor: theme.accentStrong,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },

    buttonText: { 
      color: '#fff', 
      fontSize: 16, 
      fontWeight: '800' 
    },

    registerLink: { 
      paddingTop: 19, 
      alignItems: 'center' 
    },

    registerText: { 
      color: theme.accent, 
      fontSize: 14, 
      fontWeight: '800' 
    },

  });

 // Se exporta el componente 
export default LoginScreen;