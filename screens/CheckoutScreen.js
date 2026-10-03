// El archivo CheckoutScreen.js define la pantalla de checkout o pago de la app


// Se importan las bibliotecas y componentes necesarios
import React, { useCallback, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { checkout, getCart, getPaymentMethod, savePaymentMethod } from '../services/database';
import { useAppTheme } from '../services/theme';


// Se define el componente para la pantalla de pago de los juegos
const CheckoutScreen = ({ navigation, session, onCartChange }) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const [items, setItems] = useState([]);
  const [savedCard, setSavedCard] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [holder, setHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [expiryDate, setExpiryDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });


  // Se definen los estados para el formulario de tarjeta
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef(null);


  // Se carga el carrito de compras con la tarjeta guardada
  const loadCheckout = useCallback(() => {
    setItems(getCart(session.userId));
    const method = getPaymentMethod(session.userId);
    setSavedCard(method);
    setShowCardForm(!method);
  }, [session.userId]);
  useFocusEffect(useCallback(() => loadCheckout(), [loadCheckout]));

  // Se calcula el precio total de la compra de los juegos con 2 decimales
  const total = items.reduce((sum, item) => sum + Number(item.final_price), 0);

  // Se formatea el número de la tarjeta para mostrar los espacios necesarios cada 4 digitos
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  // Se maneja el cambio de la fecha de caducidad de la tarjeta como un calendario y no texto plano
  const handleExpiryChange = (event, date) => {
    if (Platform.OS === 'android') setShowExpiryPicker(false);
    if (date) {
      setExpiryDate(date);
      setExpiry(`${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`);
    }
  };

  // Se desplaza hacia abajo para mostrar el formulario de la tarjeta, así el teclado no tapa el formulario
  const scrollToFormEnd = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
  };


  // Se maneja el pago de la compra
  const pay = async () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega un juego antes de pagar.');
      navigation.goBack();
      return;
    }

    // Se verifica que la tarjeta sea valida y se muestra un alert si no lo es
    if (!savedCard || showCardForm) {
      const digits = cardNumber.replace(/\D/g, '');
      const expirationMatch = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
      const [expiryMonth, expiryYear] = expiry.split('/').map(Number);
      const now = new Date();
      const notExpired = expirationMatch && (
        2000 + expiryYear > now.getFullYear() ||
        (2000 + expiryYear === now.getFullYear() && expiryMonth >= now.getMonth() + 1)
      );
      if (holder.trim().length < 2 || digits.length < 13 || !notExpired || !/^\d{3,4}$/.test(cvv)) {
        Alert.alert('Tarjeta incompleta', 'Revisa titular, número, vencimiento (MM/AA) y CVV.');
        return;
      }
    }

    // Se procesa el pago
    setProcessing(true);
    try {
      if (showCardForm) {
        const digits = cardNumber.replace(/\D/g, '');
        savePaymentMethod(session.userId, {
          holder: holder.trim(),
          last4: digits.slice(-4),
          expiry,
        });
      }

      // Se redirige a la pantalla de factura
      const invoice = checkout(session.userId);
      onCartChange?.();
      navigation.replace('InvoiceScreen', { invoice });
    } catch (error) {
      // Se muestra un alert si no se pudo procesar el pago
      Alert.alert('No se completó el pago', error.message);
    } finally {
      setProcessing(false);
    }
  };


  // Retorna la vista de la pantalla de checkout
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
        <Text style={styles.title}>Confirma tu compra</Text>
        <View style={styles.panel}>
          {items.map((item) => (
            <View key={item.id} style={styles.line}>
              <Text style={styles.itemName} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemPrice}>${Number(item.final_price).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.line}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Ionicons name="card-outline" size={21} color={theme.accent} />
          <Text style={styles.sectionTitle}>Forma de pago</Text>
        </View>
        {savedCard && !showCardForm ? (
          <View style={styles.savedCard}>
            <View style={styles.savedIcon}><Ionicons name="card" size={22} color={theme.accent} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>Tarjeta guardada •••• {savedCard.last4}</Text>
              <Text style={styles.muted}>{savedCard.holder} · vence {savedCard.expiry}</Text>
            </View>
            <Pressable onPress={() => setShowCardForm(true)}>
              <Text style={styles.change}>Cambiar</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.panel}>
            <Text style={styles.label}>Nombre del titular</Text>
            <TextInput style={styles.input} value={holder} onChangeText={setHolder} placeholder="Como aparece en la tarjeta" placeholderTextColor={theme.muted} autoCapitalize="words" onFocus={scrollToFormEnd} />
            <Text style={styles.label}>Número de tarjeta</Text>
            <TextInput style={styles.input} value={cardNumber} onChangeText={formatCardNumber} placeholder="0000 0000 0000 0000" placeholderTextColor={theme.muted} keyboardType="number-pad" maxLength={23} onFocus={scrollToFormEnd} />
            <View style={styles.cardDetails}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Vencimiento</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowExpiryPicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Elegir vencimiento de tarjeta en el calendario"
                >
                  <Text style={expiry ? styles.dateValue : styles.datePlaceholder}>{expiry || 'MM/AA'}</Text>
                  <Ionicons name="calendar-outline" size={19} color={theme.accent} />
                </Pressable>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>CVV</Text>
                <TextInput style={styles.input} value={cvv} onChangeText={(value) => setCvv(value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" placeholderTextColor={theme.muted} keyboardType="number-pad" secureTextEntry maxLength={4} onFocus={scrollToFormEnd} />
              </View>
            </View>
            {showExpiryPicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={expiryDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                  onChange={handleExpiryChange}
                />
                {Platform.OS === 'ios' && (
                  <Pressable style={styles.dateDoneButton} onPress={() => setShowExpiryPicker(false)}>
                    <Text style={styles.dateDoneText}>Listo</Text>
                  </Pressable>
                )}
              </View>
            )}
            <Text style={styles.securityNote}>Demo académica: no se cobra dinero. AVASA solo conserva titular, vencimiento y últimos 4 dígitos; nunca guarda el número completo ni CVV.</Text>
          </View>
        )}

        <Pressable style={[styles.payButton, processing && styles.disabled]} onPress={pay} disabled={processing}>
          <Text style={styles.payText}>{processing ? 'Procesando…' : `Pagar $${total.toFixed(2)}`}</Text>
        </Pressable>
        <Text style={styles.footerNote}>Al confirmar se simulará un pago exitoso y se generará tu factura.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


// Se definen los estilos para mejorar la apariencia visual
const makeStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },

  content: { 
    padding: 18, 
    paddingBottom: 35 
  },

  title: { 
    color: theme.text, 
    fontSize: 26, 
    fontWeight: '900', 
    marginBottom: 17 
  },

  panel: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 20 
  },

  line: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 7 },

  itemName: { 
    color: theme.text, 
    fontSize: 14, 
    fontWeight: '700', 
    flex: 1, 
    marginRight: 10 
  },

  itemPrice: { 
    color: theme.text, 
    fontWeight: '700' 
  },

  divider: { 
    height: 1, 
    backgroundColor: theme.border, 
    marginVertical: 8 
  },

  totalLabel: { 
    color: theme.text, 
    fontWeight: '800', 
    fontSize: 16 
  },

  total: { 
    color: theme.success, 
    fontWeight: '900', 
    fontSize: 23 
  },

  sectionHeading: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 10 
  },

  sectionTitle: { 
    color: theme.text, 
    fontWeight: '800', 
    fontSize: 18 
  },

  savedCard: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 18 
  },
  
  savedIcon: { 
    width: 42, 
    height: 42, 
    borderRadius: 13, 
    backgroundColor: theme.accentSoft, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  muted: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 4 
  },

  change: { 
    color: theme.accent, 
    fontWeight: '800', 
    fontSize: 12 
  },

  label: { 
    color: theme.text, 
    fontSize: 13, 
    fontWeight: '700', 
    marginBottom: 7 
  },

  input: { 
    backgroundColor: theme.input, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 11, 
    padding: 12, 
    color: theme.text, 
    marginBottom: 14, 
    fontSize: 15 
  },
  
  dateButton: { 
    backgroundColor: theme.input, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 11, 
    paddingHorizontal: 12, 
    minHeight: 48, 
    marginBottom: 14, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  
  dateValue: { 
    color: theme.text, 
    fontSize: 15 
  },

  datePlaceholder: { 
    color: theme.muted, 
    fontSize: 15 
  },

  datePickerContainer: { 
    alignItems: 'center', 
    marginBottom: 14 
  },

  dateDoneButton: { 
    alignSelf: 'flex-end', 
    paddingHorizontal: 12, 
    paddingVertical: 8 },

  dateDoneText: { 
    color: theme.accent, 
    fontWeight: '800' 
  },

  cardDetails: { 
    flexDirection: 'row', 
    gap: 12 
  },

  securityNote: { 
    color: theme.muted, 
    fontSize: 11, 
    lineHeight: 16, 
    marginTop: 1 
  },

  payButton: { 
    backgroundColor: theme.accentStrong, 
    borderRadius: 13, 
    padding: 16, 
    alignItems: 'center' 
  },

  disabled: { 
    opacity: 0.55 
  },

  payText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '900' 
  },

  footerNote: { 
    color: theme.muted, 
    textAlign: 'center', 
    fontSize: 11, 
    lineHeight: 16, 
    marginTop: 12 
  },

});


// Se exporta el componente
export default CheckoutScreen;