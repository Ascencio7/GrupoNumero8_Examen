// Se definen las funciones para filtrar los juegos

const normalizeText = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

const parsePrice = (value) => {
  if (String(value).trim() === '') return null;
  const price = Number(String(value).replace(',', '.'));
  return Number.isFinite(price) ? price : null;
};

export const filterGames = (games, { name, minPrice, maxPrice }) => {
  const normalizedName = normalizeText(name);
  const minimum = parsePrice(minPrice);
  const maximum = parsePrice(maxPrice);

  return games.filter((game) => {
    const price = Number(game.price);
    return (
      normalizeText(game.title).includes(normalizedName) &&
      (minimum === null || price >= minimum) &&
      (maximum === null || price <= maximum)
    );
  });
};
