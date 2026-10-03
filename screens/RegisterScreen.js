// El archivo RegisterScreen.js define la pantalla de registro de la app


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


// Se define la pantalla para registrarse
const RegisterScreen = ({ onRegister, navigation }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.top, insets.bottom);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);


  // Se maneja el registro para que sus datos sean correctos
  const handleRegister = async () => {
    const cleanUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[a-zA-Z0-9._-]{3,20}$/.test(cleanUsername)) {
      Alert.alert('Nombre de usuario no válido', 'Usa de 3 a 20 letras, números, puntos, guiones o guiones bajos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert('Correo no válido', 'Ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden', 'Confirma la misma contraseña en ambos campos.');
      return;
    }

    setLoading(true);
    try {
      await onRegister({ username: cleanUsername, email: normalizedEmail, password });
    } catch (error) {
      Alert.alert('No se pudo crear la cuenta', error.message);
    } finally {
      setLoading(false);
    }
  };


  // Retorna la pantalla
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <BrandLogo width={190} height={168} />
          <Text style={styles.subtitle}>Crea tu cuenta para descubrir y comprar juegos.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Ej. jugador_01"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoComplete="username-new"
            maxLength={20}
          />
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@gmail.com"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={theme.muted}
            secureTextEntry
            autoComplete="new-password"
          />
          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite tu contraseña"
            placeholderTextColor={theme.muted}
            secureTextEntry
            autoComplete="new-password"
          />
          <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
          </Pressable>
          <Pressable style={styles.loginLink} onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>Ya tengo cuenta · Iniciar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme, topInset, bottomInset) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },

  content: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 24, 
    paddingTop: topInset + 20, 
    paddingBottom: bottomInset + 20 
  },

  brand: { 
    alignItems: 'center', 
    marginBottom: 23 
  },

  subtitle: { 
    color: theme.muted, 
    fontSize: 13, 
    marginTop: 5, 
    textAlign: 'center' 
  },

  card: { 
    backgroundColor: theme.surface, 
    borderWidth: 1, 
    borderColor: theme.border, 
    borderRadius: 20, 
    padding: 20 
  },

  label: { 
    color: theme.text, 
    fontSize: 13, 
    fontWeight: '700', 
    marginBottom: 6 
  },

  input: { 
    backgroundColor: theme.input, 
    borderWidth: 1, 
    borderColor: theme.border, 
    borderRadius: 11, 
    color: theme.text, 
    paddingHorizontal: 13, 
    paddingVertical: 11, 
    fontSize: 15, 
    marginBottom: 13 
  },
  
  button: { 
    minHeight: 48, 
    backgroundColor: theme.accentStrong, 
    borderRadius: 11, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 4 },
  
  buttonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: '800' 
  },

  loginLink: { 
    alignItems: 'center', 
    paddingTop: 17 
  },

  loginText: { 
    color: theme.accent, 
    fontSize: 13, 
    fontWeight: '800' 
  },

});


// Se exporta el componente
export default RegisterScreen;