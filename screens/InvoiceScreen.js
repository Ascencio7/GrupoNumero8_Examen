// El archivo InvoiceScreen.js define la pantalla de factura de la app


// Se importan las bibliotecas y componentes necesarios
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../services/theme';


// Se define la pantalla de factura de la app
const InvoiceScreen = ({ route, navigation }) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const invoice = route.params?.invoice;


  // Se verifica si hay una factura para mostrar
  if (!invoice) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay una factura para mostrar.</Text>
        <Pressable style={styles.button} onPress={() => navigation.popTo('MainTabs')}>
          <Text style={styles.buttonText}>Volver a AVASA</Text>
        </Pressable>
      </View>
    );
  }


  // Retorna la pantalla
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.success}>
        <View style={styles.check}><Ionicons name="checkmark" size={34} color="#fff" /></View>
        <Text style={styles.successTitle}>¡Compra exitosa!</Text>
        <Text style={styles.muted}>Los juegos ya están en tu biblioteca.</Text>
      </View>
      <View style={styles.invoice}>
        <View style={styles.invoiceHeader}>
          <View>
            <Text style={styles.brand}>AVASA</Text>
            <Text style={styles.muted}>Factura de compra</Text>
          </View>
          <Ionicons name="receipt-outline" size={28} color={theme.accent} />
        </View>
        <Text style={styles.invoiceNumber}>Folio: {invoice.invoice}</Text>
        <Text style={styles.date}>{new Date(invoice.purchasedAt).toLocaleString()}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Productos adquiridos</Text>
        {invoice.items.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.muted}>{item.genre}</Text>
            </View>
            <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total pagado</Text>
          <Text style={styles.total}>${Number(invoice.total).toFixed(2)}</Text>
        </View>
        <Text style={styles.payment}>Pago simulado · Tarjeta terminada en {invoice.paymentMethod?.last4}</Text>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.popTo('MainTabs')}>
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
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
    padding: 18, 
    paddingBottom: 32 
  },

  success: { 
    alignItems: 'center', 
    padding: 14, 
    marginBottom: 10 
  },

  check: { 
    width: 66, 
    height: 66, 
    borderRadius: 33, 
    backgroundColor: theme.success, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },

  successTitle: { 
    color: theme.text, 
    fontSize: 23, 
    fontWeight: '900', 
    marginBottom: 4 
  },

  muted: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 4 
  },

  invoice: { 
    backgroundColor: theme.surface, 
    borderColor: theme.border, 
    borderWidth: 1, 
    borderRadius: 18, 
    padding: 18 
  },

  invoiceHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  brand: { 
    color: theme.text, 
    fontWeight: '900', 
    fontSize: 23, 
    letterSpacing: 2 
  },

  invoiceNumber: { 
    color: theme.text, 
    fontWeight: '700', 
    fontSize: 13, 
    marginTop: 18 
  },

  date: { 
    color: theme.muted, 
    fontSize: 12, 
    marginTop: 4 
  },

  divider: { 
    height: 1, 
    backgroundColor: theme.border, 
    marginVertical: 14 
  },

  sectionTitle: { 
    color: theme.text, 
    fontSize: 16, 
    fontWeight: '800', 
    marginBottom: 8 
  },

  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 8 
  },

  itemName: { 
    color: theme.text, 
    fontWeight: '700', 
    fontSize: 14 
  },

  price: { 
    color: theme.text, 
    fontWeight: '800' 
  },

  totalLabel: { 
    color: theme.text, 
    fontWeight: '800', 
    fontSize: 16 
  },

  total: { 
    color: theme.success, 
    fontWeight: '900', 
    fontSize: 21 
  },

  payment: { 
    color: theme.muted, 
    fontSize: 11, 
    textAlign: 'center', 
    marginTop: 12 
  },

  button: { 
    backgroundColor: theme.accentStrong, 
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center', 
    marginTop: 16 
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 15 
  },

  title: { 
    color: theme.text, 
    fontSize: 20, 
    fontWeight: '800' 
  },

});


// Se exporta el componente
export default InvoiceScreen;