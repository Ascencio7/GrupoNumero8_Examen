# AVASA

**AVASA** es una aplicación móvil académica que simula una tienda de videojuegos. Incluye una experiencia de cliente y herramientas de administración, con catálogo, promociones, carrito, pagos y compras de demostración.

> La aplicación funciona localmente para fines educativos. No utiliza un servicio de autenticación ni procesa pagos reales.

## Requisitos

- Node.js y npm.
- Android Studio o un dispositivo Android para ejecutar la versión Android.
- Xcode y macOS para compilar o ejecutar la versión iOS.

## Instalación y ejecución

Desde la carpeta del proyecto:

```bash
npm ci
npx expo start
```

El servidor de Expo muestra un código QR para abrir la aplicación en un dispositivo compatible. También se pueden usar los comandos del `package.json`:

```bash
npm run android
npm run ios
npm run web
```

Para iniciar Expo limpiando la caché de Metro:

```bash
npx expo start -c
```

## Funcionalidades

### Cliente

- Crear una cuenta con nombre de usuario, correo y contraseña; iniciar sesión con el usuario o el correo.
- Explorar el catálogo y las promociones, y filtrar los juegos por nombre y rango de precio.
- Agregar un juego al carrito. No se puede agregar el mismo título dos veces ni un juego que ya se haya comprado.
- Consultar el número de productos en el icono del carrito, quitar productos y revisar el total antes de pagar.
- Registrar una tarjeta de demostración cuando sea necesario. El vencimiento se selecciona con un calendario.
- Completar una compra simulada, consultar la factura y encontrar los títulos adquiridos en la biblioteca.
- Abrir la simulación de juego desde la biblioteca.

### Administrador

- Agregar, editar y eliminar juegos; la imagen del juego es opcional.
- Asignar una categoría de la lista disponible y activar o desactivar promociones.
- Filtrar los juegos por nombre y rango de precio.
- Crear registros de clientes y activar o desactivar sus cuentas.
- Buscar clientes por correo.

### Experiencia y navegación

- Cambiar entre tema claro y oscuro desde el perfil.
- Navegar entre las pestañas inferiores con un toque o mediante gestos de deslizamiento.
- Ver el contador del carrito y usar confirmación antes de cerrar sesión.
- Elegir la fecha de lanzamiento de un juego con un calendario.

## Acceso de demostración

- **Cliente:** crea una cuenta desde la pantalla de registro.
- **Administrador:** la cuenta reservada es `admin@avasa.com` (también se reconoce el identificador `admin`). La pantalla solicita una contraseña, pero la autenticación administrativa de demostración no verifica su valor.

La validación y las cuentas son locales y no deben considerarse un mecanismo de seguridad para producción.

## Datos y privacidad de la demostración

- **SQLite** (`avasa_exam.db`) guarda los juegos, usuarios, carrito, métodos de pago resumidos y compras en el dispositivo.
- **AsyncStorage** conserva la sesión y la preferencia de tema.
- Las contraseñas de clientes se guardan como hashes locales.
- En el método de pago solo se conservan el titular, el vencimiento y los últimos cuatro dígitos. El número completo y el CVV no se guardan.
- No se conecta a una pasarela de pago ni se transfiere información a un servidor.
- Si el catálogo está vacío al iniciar, se cargan juegos de ejemplo.

## Estructura del proyecto

```text
.
├── App.js                    # Navegación, sesión y estado global del carrito
├── app.json                  # Configuración de Expo
├── components/               # Logos y componentes reutilizables de filtros
├── screens/                  # Pantallas de cliente, administración y pago
├── services/
│   ├── database.js           # SQLite y operaciones de datos
│   ├── storage.js            # Sesión y tema con AsyncStorage
│   ├── credentials.js        # Hash y verificación de contraseñas
│   ├── gameCategories.js     # Categorías disponibles
│   └── gameFilters.js        # Filtrado del catálogo
└── logoImage/                # Imágenes de marca AVASA
```

## Exportar el bundle de Android

Para generar una exportación del bundle JavaScript de Android:

```bash
npx expo export --platform android
```

El resultado se escribe en `dist/`. Esta exportación valida y empaqueta el bundle; no genera por sí sola un APK instalable.

## Tecnologías principales

- Expo SDK 57 y React Native.
- React Navigation: navegación por pestañas y pantallas.
- Expo SQLite y AsyncStorage: persistencia local.
- Expo Crypto: hash de contraseñas.
- React Native Community DateTimePicker: selección de fechas.
