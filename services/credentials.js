// El archivo credentials.js define las funciones para crear y verificar hashes de contraseña


import * as Crypto from 'expo-crypto';

const HASH_ALGORITHM = Crypto.CryptoDigestAlgorithm.SHA256;

export const createPasswordHash = async (password) => {
  const salt = Crypto.randomUUID();
  const digest = await Crypto.digestStringAsync(HASH_ALGORITHM, `${salt}:${password}`);
  return `${salt}:${digest}`;
};

export const verifyPassword = async (password, storedHash) => {
  const [salt, expectedDigest] = storedHash.split(':');
  if (!salt || !expectedDigest) return false;
  const digest = await Crypto.digestStringAsync(HASH_ALGORITHM, `${salt}:${password}`);
  return digest === expectedDigest;
};
