// El archivo App.js define la navegación de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';
import ProfileScreen from './screens/ProfileScreen';
import GameDetailsScreen from './screens/GameDetailsScreen';
import GameFormScreen from './screens/GameFormScreen';
import GameCategoriesScreen from './screens/GameCategoriesScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import AdminGamesScreen from './screens/AdminGamesScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';
import PlayScreen from './screens/PlayScreen';
import {
  findUserByIdentifier,
  getCart,
  getOrCreateClient,
  initializeDatabase,
  registerClient,
  setUserPasswordHash,
} from './services/database';
import { createPasswordHash, verifyPassword } from './services/credentials';
import { clearSession, getSession, getTheme, saveSession, saveTheme } from './services/storage';
import { ThemeProvider, useAppTheme } from './services/theme';


// Se definen las rutas de navegación
const RootStack = createNativeStackNavigator();
const Tabs = createMaterialTopTabNavigator();
const ADMIN_EMAIL = 'admin@avasa.com';


// Se define la navegación principal
const MainTabs = ({ session, darkMode, onThemeChange, onLogout, cartCount, onCartChange }) => {
  const theme = useAppTheme();
  const isAdmin = session.role === 'admin';
  const tabScreens = isAdmin
    ? [
        { name: 'StoreTab', component: HomeScreen, title: 'Tienda', icon: 'storefront-outline' },
        { name: 'AdminGamesTab', component: AdminGamesScreen, title: 'Juegos', icon: 'game-controller-outline' },
        { name: 'AdminUsersTab', component: AdminUsersScreen, title: 'Usuarios', icon: 'people-outline' },
      ]
    : [
        { name: 'StoreTab', component: HomeScreen, title: 'Tienda', icon: 'storefront-outline' },
        { name: 'LibraryTab', component: ListScreen, title: 'Biblioteca', icon: 'library-outline' },
        { name: 'CartTab', component: CartScreen, title: 'Carrito', icon: 'cart-outline' },
      ];


  // Retorna la navegación    
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: theme.surface }}>
      <Tabs.Navigator
        tabBarPosition="bottom"
        screenOptions={({ route }) => {
          const activeScreen = tabScreens.find((screen) => screen.name === route.name);
          return {
            swipeEnabled: true,
            lazy: true,
            tabBarShowIcon: true,
            tabBarShowLabel: false,
            tabBarBadge: route.name === 'CartTab' && cartCount > 0
              ? () => (
                  <View style={{ minWidth: 18, height: 18, borderRadius: 9, backgroundColor: theme.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )
              : undefined,
            tabBarStyle: {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              height: 56,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarIndicatorStyle: { backgroundColor: theme.accent, height: 2 },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.muted,
            tabBarIcon: ({ color }) => (
              <Ionicons name={activeScreen?.icon || 'person-outline'} size={21} color={color} />
            ),
          };
        }}
      >
        {tabScreens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            options={{ title: screen.title, tabBarLabel: screen.title }}
          >
            {(props) => <screen.component {...props} session={session} onCartChange={onCartChange} />}
          </Tabs.Screen>
        ))}
        <Tabs.Screen name="ProfileTab" options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={21} color={color} />,
        }}>
          {(props) => (
            <ProfileScreen
              {...props}
              session={session}
              darkMode={darkMode}
              onThemeChange={onThemeChange}
              onLogout={onLogout}
            />
          )}
        </Tabs.Screen>
      </Tabs.Navigator>
    </SafeAreaView>
  );
};


// Se define una funcion para manejar la navegación principal
function AppNavigation({ session, onLogin, onRegister, onLogout, darkMode, onThemeChange, cartCount, onCartChange }) {
  const theme = useAppTheme();
  const navigationTheme = darkMode ? DarkTheme : DefaultTheme;

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <NavigationContainer
        theme={{
          ...navigationTheme,
          colors: {
            ...navigationTheme.colors,
            background: theme.background,
            card: theme.surface,
            text: theme.text,
            border: theme.border,
            primary: theme.accent,
          },
        }}
      >
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.surface },
            headerTintColor: theme.text,
            headerTitleStyle: { fontWeight: '800' },
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          {!session ? (
            <>
              <RootStack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} onLogin={onLogin} />}
              </RootStack.Screen>
              <RootStack.Screen name="Register" options={{ title: 'Crear cuenta' }}>
                {(props) => <RegisterScreen {...props} onRegister={onRegister} />}
              </RootStack.Screen>
            </>
          ) : (
            <>
              <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
                {() => (
                  <MainTabs
                    session={session}
                    darkMode={darkMode}
                    onThemeChange={onThemeChange}
                    onLogout={onLogout}
                    cartCount={cartCount}
                    onCartChange={onCartChange}
                  />
                )}
              </RootStack.Screen>
              <RootStack.Screen name="GameDetails" options={{ title: 'Juego' }}>
                {(props) => <GameDetailsScreen {...props} session={session} onCartChange={onCartChange} />}
              </RootStack.Screen>
              <RootStack.Screen name="DataEntryScreen" options={{ title: 'Gestión de juego' }}>
                {(props) => <GameFormScreen {...props} session={session} />}
              </RootStack.Screen>
              <RootStack.Screen name="GameCategoriesScreen" component={GameCategoriesScreen} options={{ title: 'Categorías' }} />
              <RootStack.Screen name="CheckoutScreen" options={{ title: 'Pago simulado' }}>
                {(props) => <CheckoutScreen {...props} session={session} onCartChange={onCartChange} />}
              </RootStack.Screen>
              <RootStack.Screen name="InvoiceScreen" component={InvoiceScreen} options={{ title: 'Factura AVASA', gestureEnabled: false }} />
              <RootStack.Screen name="PlayScreen" component={PlayScreen} options={{ title: 'Simulación de juego' }} />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}


// Se exporta el componente por defecto
export default function App() {
  const [session, setSession] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [ready, setReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(() => {
    setCartCount(session?.role === 'client' ? getCart(session.userId).length : 0);
  }, [session]);

  useEffect(() => {
    const initialize = async () => {
      try {
        initializeDatabase();
        const [storedSession, themePreference] = await Promise.all([getSession(), getTheme()]);
        let restoredSession = null;
        if (storedSession?.email === ADMIN_EMAIL) {
          restoredSession = { ...storedSession, role: 'admin' };
        } else if (storedSession?.email) {
          const existing = getOrCreateClient(storedSession.email);
          restoredSession = existing?.active
            ? { ...storedSession, role: 'client', userId: existing.id }
            : null;
        }
        setSession(restoredSession);
        setCartCount(restoredSession?.role === 'client' ? getCart(restoredSession.userId).length : 0);
        setDarkMode(themePreference);
      } catch (error) {
        Alert.alert('No se pudo iniciar AVASA', error.message);
      } finally {
        setReady(true);
      }
    };
    initialize();
  }, []);


  // Se maneja el inicio de sesión
  const handleLogin = async (identifier, password) => {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    if (normalizedIdentifier === ADMIN_EMAIL || normalizedIdentifier === 'admin') {
      const adminSession = { email: ADMIN_EMAIL, userName: 'admin', role: 'admin' };
      await saveSession(adminSession);
      setSession(adminSession);
      setCartCount(0);
      return;
    }

    const user = findUserByIdentifier(normalizedIdentifier);
    if (!user) throw new Error('No encontramos esa cuenta. Puedes registrarte para crear una.');
    if (!user.active) throw new Error('Esta cuenta está desactivada. Contacta con administración.');

    const passwordHash = await createPasswordHash(password);
    if (!user.password_hash) {
      // Existing demo accounts receive a password the first time they use this version.
      setUserPasswordHash(user.id, passwordHash);
    } else if (!(await verifyPassword(password, user.password_hash))) {
      throw new Error('La contraseña no es correcta.');
    }

    const loggedInSession = {
      email: user.email,
      userName: user.username,
      role: 'client',
      userId: user.id,
    };
    await saveSession(loggedInSession);
    setSession(loggedInSession);
    setCartCount(getCart(user.id).length);
  };


  // Se maneja el registro
  const handleRegister = async ({ username, email, password }) => {
    if (email.toLowerCase() === ADMIN_EMAIL || username.trim().toLowerCase() === 'admin') {
      throw new Error('Ese nombre o correo está reservado.');
    }
    const passwordHash = await createPasswordHash(password);
    const user = registerClient({ username, email, passwordHash });
    const registeredSession = {
      email: user.email,
      userName: user.username,
      role: 'client',
      userId: user.id,
    };
    await saveSession(registeredSession);
    setSession(registeredSession);
    setCartCount(getCart(user.id).length);
  };


  // Se maneja el cierre de sesión
  const handleLogout = async () => {
    await clearSession();
    setSession(null);
    setCartCount(0);
  };


  // Se maneja el cambio de tema
  const handleThemeChange = async (nextValue) => {
    setDarkMode(nextValue);
    await saveTheme(nextValue);
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: darkMode ? '#0b1020' : '#f1f5f9' }}>
        <ActivityIndicator size="large" color="#2878d0" />
      </View>
    );
  }


  // Retorna la pantalla
  return (
    <SafeAreaProvider>
      <ThemeProvider darkMode={darkMode}>
        <AppNavigation
          session={session}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          darkMode={darkMode}
          onThemeChange={handleThemeChange}
          cartCount={cartCount}
          onCartChange={refreshCartCount}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
