// El archivo database.js define funciones para interactuar con la base de datos
// de SQLite. Así se puede crear, editar, eliminar y consultar juegos, categorías,
// usuarios, carrito, tarjetas resumidas y compras.
// El proyecto nunca guarda el número completo ni el CVV y no procesa cobros.

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('avasa_exam.db');

const seedGames = [
  {
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    rating: 4.7,
    price: 59.99,
    release: '2024-01-15',
    description: 'Una aventura futurista llena de decisiones y múltiples rutas narrativas.',
  },
  {
    title: 'Helldivers 2',
    genre: 'Cooperativo',
    rating: 4.8,
    price: 39.99,
    release: '2024-02-08',
    description: 'Acción cooperativa intensa, misiones desafiantes y explosivos encuentros.',
  },
  {
    title: 'Baldurs Gate 3',
    genre: 'Aventura',
    rating: 4.9,
    price: 49.99,
    release: '2023-08-03',
    description: 'Un RPG profundo con historia envolvente, decisiones críticas y combate táctico.',
  },
  {
    title: 'Hades II',
    genre: 'Roguelite',
    rating: 4.6,
    price: 29.99,
    release: '2025-04-30',
    description: 'Una nueva odisea con combates rápidos, habilidades únicas y mucha rejugabilidad.',
  },
];

const gameFields = ['image', 'promotion'];

const addMissingGameFields = () => {
  const columns = db.getAllSync('PRAGMA table_info(games)').map((column) => column.name);
  gameFields.forEach((field) => {
    if (!columns.includes(field)) {
      const type = field === 'promotion' ? 'INTEGER NOT NULL DEFAULT 0' : 'TEXT';
      db.execSync(`ALTER TABLE games ADD COLUMN ${field} ${type}`);
    }
  });
};

const addMissingUserFields = () => {
  const columns = db.getAllSync('PRAGMA table_info(users)').map((column) => column.name);
  if (!columns.includes('username')) {
    db.execSync("ALTER TABLE users ADD COLUMN username TEXT NOT NULL DEFAULT ''");
  }
  if (!columns.includes('password_hash')) {
    db.execSync("ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''");
  }
  db.runSync(
    "UPDATE users SET username = substr(email, 1, instr(email, '@') - 1) WHERE username = ''",
  );
};

export const initializeDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      rating REAL NOT NULL,
      price REAL NOT NULL,
      release TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      username TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'client',
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS cart (
      user_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, game_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (game_id) REFERENCES games(id)
    );
    CREATE TABLE IF NOT EXISTS payment_methods (
      user_id INTEGER PRIMARY KEY,
      holder TEXT NOT NULL,
      last4 TEXT NOT NULL,
      expiry TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      purchased_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  addMissingGameFields();
  addMissingUserFields();

  const count = db.getFirstSync('SELECT COUNT(*) AS count FROM games').count;
  if (count === 0) {
    seedGames.forEach((game) => {
      db.runSync(
        'INSERT INTO games (title, genre, rating, price, release, description, image, promotion) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
        [game.title, game.genre, game.rating, game.price, game.release, game.description, null],
      );
    });
  }
};

export const getGames = () => db.getAllSync('SELECT * FROM games ORDER BY id DESC');

export const getGame = (id) => db.getFirstSync('SELECT * FROM games WHERE id = ?', [id]);

export const addGame = (game) => {
  const duplicate = db.getFirstSync(
    'SELECT id FROM games WHERE title = ? COLLATE NOCASE LIMIT 1',
    [game.title.trim()],
  );
  if (duplicate) throw new Error('Ya existe un juego con ese título en el catálogo.');

  const result = db.runSync(
    'INSERT INTO games (title, genre, rating, price, release, description, image, promotion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      game.title,
      game.genre,
      game.rating,
      game.price,
      game.release,
      game.description,
      game.image || null,
      game.promotion || 0,
    ],
  );
  return result.lastInsertRowId;
};

export const updateGame = (id, game) => {
  const duplicate = db.getFirstSync(
    'SELECT id FROM games WHERE title = ? COLLATE NOCASE AND id != ? LIMIT 1',
    [game.title.trim(), id],
  );
  if (duplicate) throw new Error('Ya existe otro juego con ese título en el catálogo.');

  db.runSync(
    'UPDATE games SET title = ?, genre = ?, rating = ?, price = ?, release = ?, description = ?, image = ?, promotion = ? WHERE id = ?',
    [
      game.title,
      game.genre,
      game.rating,
      game.price,
      game.release,
      game.description,
      game.image || null,
      game.promotion || 0,
      id,
    ],
  );
};

export const deleteGame = (id) => {
  const purchased = db.getFirstSync(
    'SELECT COUNT(*) AS count FROM purchases WHERE game_id = ?',
    [id],
  ).count;
  if (purchased > 0) {
    throw new Error('No se puede eliminar: un cliente ya adquirió este juego.');
  }
  db.runSync('DELETE FROM cart WHERE game_id = ?', [id]);
  db.runSync('DELETE FROM games WHERE id = ?', [id]);
};

export const getOrCreateClient = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  db.runSync(
    "INSERT OR IGNORE INTO users (email, username, role, active) VALUES (?, ?, 'client', 1)",
    [normalizedEmail, normalizedEmail.split('@')[0]],
  );
  return db.getFirstSync('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
};

export const findUserByIdentifier = (identifier) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  return db.getFirstSync(
    'SELECT * FROM users WHERE email = ? COLLATE NOCASE OR username = ? COLLATE NOCASE LIMIT 1',
    [normalizedIdentifier, normalizedIdentifier],
  );
};

export const registerClient = ({ username, email, passwordHash }) => {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.getFirstSync(
    'SELECT id FROM users WHERE email = ? COLLATE NOCASE OR username = ? COLLATE NOCASE LIMIT 1',
    [normalizedEmail, normalizedUsername],
  );
  if (existing) {
    throw new Error('Ese correo o nombre de usuario ya está registrado.');
  }

  const result = db.runSync(
    "INSERT INTO users (email, username, password_hash, role, active) VALUES (?, ?, ?, 'client', 1)",
    [normalizedEmail, normalizedUsername, passwordHash],
  );
  return db.getFirstSync('SELECT * FROM users WHERE id = ?', [result.lastInsertRowId]);
};

export const setUserPasswordHash = (userId, passwordHash) => {
  db.runSync('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
};

export const getUsers = () =>
  db.getAllSync("SELECT id, email, username, role, active FROM users WHERE role = 'client' ORDER BY email COLLATE NOCASE");

export const setUserActive = (userId, active) => {
  db.runSync('UPDATE users SET active = ? WHERE id = ? AND role = ?', [active ? 1 : 0, userId, 'client']);
};

export const getCart = (userId) =>
  db.getAllSync(
    `SELECT games.*, CASE WHEN games.promotion > 0
      THEN ROUND(games.price * (100 - games.promotion) / 100.0, 2)
      ELSE games.price END AS final_price
     FROM cart JOIN games ON games.id = cart.game_id
     WHERE cart.user_id = ? ORDER BY games.title`,
    [userId],
  );

export const addToCart = (userId, gameId) => {
  const owned = db.getFirstSync(
    'SELECT id FROM purchases WHERE user_id = ? AND game_id = ? LIMIT 1',
    [userId, gameId],
  );
  if (owned) return { added: false, reason: 'owned' };

  const result = db.runSync(
    'INSERT OR IGNORE INTO cart (user_id, game_id) VALUES (?, ?)',
    [userId, gameId],
  );
  return result.changes > 0
    ? { added: true }
    : { added: false, reason: 'inCart' };
};

export const removeFromCart = (userId, gameId) => {
  db.runSync('DELETE FROM cart WHERE user_id = ? AND game_id = ?', [userId, gameId]);
};

export const getOwnedGames = (userId) =>
  db.getAllSync(
    `SELECT games.*, purchases.purchased_at
     FROM purchases JOIN games ON games.id = purchases.game_id
     WHERE purchases.user_id = ? ORDER BY purchases.purchased_at DESC`,
    [userId],
  );

export const getPaymentMethod = (userId) =>
  db.getFirstSync('SELECT holder, last4, expiry FROM payment_methods WHERE user_id = ?', [userId]);

export const savePaymentMethod = (userId, { holder, last4, expiry }) => {
  db.runSync(
    `INSERT INTO payment_methods (user_id, holder, last4, expiry) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET holder = excluded.holder, last4 = excluded.last4, expiry = excluded.expiry`,
    [userId, holder, last4, expiry],
  );
};

export const checkout = (userId) => {
  const paymentMethod = getPaymentMethod(userId);
  if (!paymentMethod) throw new Error('Agrega un método de pago antes de continuar.');

  const items = getCart(userId);
  if (items.length === 0) throw new Error('El carrito está vacío.');

  const invoice = `AV-${Date.now()}`;
  const purchasedAt = new Date().toISOString();
  db.execSync('BEGIN');
  try {
    items.forEach((item) => {
      const alreadyOwned = db.getFirstSync(
        'SELECT id FROM purchases WHERE user_id = ? AND game_id = ? LIMIT 1',
        [userId, item.id],
      );
      if (alreadyOwned) {
        throw new Error(`${item.title} ya está en tu biblioteca.`);
      }
      db.runSync(
        'INSERT INTO purchases (invoice, user_id, game_id, title, price, purchased_at) VALUES (?, ?, ?, ?, ?, ?)',
        [invoice, userId, item.id, item.title, item.final_price, purchasedAt],
      );
    });
    db.runSync('DELETE FROM cart WHERE user_id = ?', [userId]);
    db.execSync('COMMIT');
  } catch (error) {
    db.execSync('ROLLBACK');
    throw error;
  }

  return {
    invoice,
    purchasedAt,
    items: items.map((item) => ({ ...item, price: item.final_price })),
    total: items.reduce((sum, item) => sum + Number(item.final_price), 0),
    paymentMethod,
  };
};

export const playGame = (gameId, userId) => {
  return Boolean(
    db.getFirstSync(
      'SELECT id FROM purchases WHERE user_id = ? AND game_id = ? LIMIT 1',
      [userId, gameId],
    ),
  );
};
