// El archivo AdminUsersScreen.js es la gestión del admin sobre crear, activar o desactivar a los usuarios del sistema


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getOrCreateClient, getUsers, setUserActive } from '../services/database';
import { useAppTheme } from '../services/theme';
import ControlLogo from '../components/ControlLogo';


// Se define la pantalla del admin que gestionará a los usuarios
const AdminUsersScreen = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets.top);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const filteredUsers = useMemo(() => {
    const query = emailFilter.trim().toLowerCase();
    return users.filter((user) => String(user.email || '').toLowerCase().includes(query));
  }, [users, emailFilter]);

  // Se carga la lista de usuarios
  const load = useCallback(() => setUsers(getUsers()), []);
  useFocusEffect(useCallback(() => load(), [load]));


  // Se agrega un nuevo cliente por correo
  const addClient = () => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized === 'admin@avasa.com') {
      Alert.alert('Correo no válido', 'Ingresa un correo válido de cliente. admin@avasa.com está reservado para administración.');
      return;
    }
    const client = getOrCreateClient(normalized);
    if (client.role !== 'client') {
      Alert.alert('No se puede agregar', 'El correo está reservado para administración.');
      return;
    }
    setEmail('');
    load();
  };


  // Se activa o desactiva un usuario existente
  const toggleActive = (user, active) => {
    Alert.alert(
      active ? 'Activar cuenta' : 'Desactivar cuenta',
      `${active ? '¿Activar' : '¿Desactivar'} el acceso de ${user.email}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => { setUserActive(user.id, active); load(); } },
      ],
    );
  };


  // Retorna los filtros de los usuarios
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.brand}>AVASA</Text>
          <Text style={styles.heading}>Gestionar usuarios</Text>
        </View>
        <ControlLogo width={42} height={42} style={styles.headerLogo} />
      </View>
      <Text style={styles.muted}>Altas de clientes y control de acceso.</Text>
      <View style={styles.addPanel}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Pressable style={styles.addButton} onPress={addClient}>
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.addText}>Agregar cliente</Text>
        </Pressable>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.filterRow}>
            <Ionicons name="search-outline" size={18} color={theme.muted} />
            <TextInput
              style={styles.filterInput}
              value={emailFilter}
              onChangeText={setEmailFilter}
              placeholder="Filtrar por correo"
              placeholderTextColor={theme.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="search"
            />
            <Pressable
              onPress={() => setEmailFilter('')}
              accessibilityRole="button"
              accessibilityLabel="Limpiar filtro de correo"
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={20} color={theme.accent} />
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.muted}>
            {emailFilter ? 'No se encontraron usuarios con ese correo.' : 'Todavía no hay cuentas de cliente.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.avatar}><Ionicons name="person" size={19} color={theme.accent} /></View>
            <View style={styles.userInfo}>
              <Text style={styles.email}>{item.username || item.email}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={[styles.status, item.active ? styles.active : styles.inactive]}>{item.active ? 'Activo' : 'Desactivado'}</Text>
            </View>
            <Switch value={Boolean(item.active)} onValueChange={(value) => toggleActive(item, value)} trackColor={{ true: theme.accent }} />
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
    paddingHorizontal: 17, 
    paddingTop: topInset + 17, 
    paddingBottom: 17 
  },

  heading: { 
    color: theme.text, 
    fontSize: 23, 
    fontWeight: '900' 
  },

  headingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },

  brand: { 
    color: theme.accent, 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 1.5, 
    marginBottom: 2 
  },

  headerLogo: { 
    borderRadius: 8 
  },

  muted: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 5, 
    marginBottom: 12 
  },

  addPanel: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 12, 
    marginBottom: 15 
  },

  input: { 
    borderWidth: 1, 
    borderColor: theme.border, 
    backgroundColor: theme.input, 
    borderRadius: 10, color: theme.text, 
    paddingHorizontal: 12, 
    paddingVertical: 11, 
    marginBottom: 9 
  },

  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 7, 
    backgroundColor: theme.accentStrong, 
    borderRadius: 10, padding: 12 
  },

  addText: { 
    color: '#fff', 
    fontWeight: '800' 
  },

  list: { 
    paddingBottom: 24 
  },

  filterRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, borderRadius: 11, 
    paddingHorizontal: 11, 
    marginBottom: 12 
  },

  filterInput: { 
    flex: 1, 
    color: theme.text, 
    paddingVertical: 10 
  },

  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 14, 
    padding: 12, 
    marginBottom: 9 
  },

  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 13, 
    backgroundColor: theme.accentSoft, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 11 
  },

  userInfo: { 
    flex: 1, 
    minWidth: 0 
  },

  email: { 
    color: theme.text, 
    fontSize: 13, 
    fontWeight: '800' 
  },

  userEmail: { 
    color: theme.muted, 
    fontSize: 11, 
    marginTop: 3 },
  
  status: { 
    fontSize: 11, 
    fontWeight: '800', 
    marginTop: 4 },

  active: { 
    color: theme.success 
  },

  inactive: { 
    color: theme.danger 
  },

});


// Se exporta el componente
export default AdminUsersScreen;