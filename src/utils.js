import { WORD_PAIRS } from "./wordPairs";

export const getAllCategories = () => {
  const categories = [...new Set(WORD_PAIRS.map((pair) => pair.category))];
  return categories;
};

export const getWordCountForCategory = (category) => {
  return WORD_PAIRS.filter((pair) => pair.category === category).length;
};

export const loadSettingsFromStorage = () => {
  const storedDisplayCategory = localStorage.getItem("displayCategory");
  const storedDisplayImpostorHint = localStorage.getItem("displayImpostorHint");
  const storedEnabledCategories = localStorage.getItem("enabledCategories");
  const storedPlayerCount = localStorage.getItem("playerCount");
  const storedImpostorCount = localStorage.getItem("impostorCount");

  const MIN = 3;
  const MAX = 12;
  let playerCount = 3;
  if (storedPlayerCount !== null) {
    const parsed = JSON.parse(storedPlayerCount);
    // Validate player count is within bounds
    if (parsed >= MIN && parsed <= MAX) {
      playerCount = parsed;
    }
  }

  let impostorCount = 1;
  if (storedImpostorCount !== null) {
    const parsed = JSON.parse(storedImpostorCount);
    // Validate impostor count is at least 1 and less than player count
    if (parsed >= 1 && parsed < playerCount) {
      impostorCount = parsed;
    }
  }

  return {
    displayCategory:
      storedDisplayCategory !== null
        ? JSON.parse(storedDisplayCategory)
        : false,
    displayImpostorHint:
      storedDisplayImpostorHint !== null
        ? JSON.parse(storedDisplayImpostorHint)
        : true,
    enabledCategories: storedEnabledCategories
      ? new Set(JSON.parse(storedEnabledCategories))
      : new Set(getAllCategories()),
    playerCount,
    impostorCount,
  };
};
