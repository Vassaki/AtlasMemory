import { useState, useCallback, useEffect } from 'react';

// Expanded dataset of 18 beautiful countries for "Level 5 Master" (6x6) 18-pair difficulty
const COUNTRIES_DB = [
  { id: 'jp', name: 'Japan', iso: 'jp' },
  { id: 'ca', name: 'Canada', iso: 'ca' },
  { id: 'br', name: 'Brazil', iso: 'br' },
  { id: 'gb', name: 'United Kingdom', iso: 'gb' },
  { id: 'za', name: 'South Africa', iso: 'za' },
  { id: 'au', name: 'Australia', iso: 'au' },
  { id: 'kr', name: 'South Korea', iso: 'kr' },
  { id: 'it', name: 'Italy', iso: 'it' },
  { id: 'eg', name: 'Egypt', iso: 'eg' },
  { id: 'ar', name: 'Argentina', iso: 'ar' },
  { id: 'in', name: 'India', iso: 'in' },
  { id: 'mx', name: 'Mexico', iso: 'mx' },
  { id: 'fr', name: 'France', iso: 'fr' },
  { id: 'de', name: 'Germany', iso: 'de' },
  { id: 'es', name: 'Spain', iso: 'es' },
  { id: 'se', name: 'Sweden', iso: 'se' },
  { id: 'ch', name: 'Switzerland', iso: 'ch' },
  { id: 'nz', name: 'New Zealand', iso: 'nz' },
  { id: 'us', name: 'United States', iso: 'us' },
  { id: 'cn', name: 'China', iso: 'cn' },
  { id: 'ru', name: 'Russia', iso: 'ru' },
  { id: 'nl', name: 'Netherlands', iso: 'nl' },
  { id: 'gr', name: 'Greece', iso: 'gr' },
  { id: 'tr', name: 'Turkey', iso: 'tr' },
  { id: 'fi', name: 'Finland', iso: 'fi' },
  { id: 'no', name: 'Norway', iso: 'no' },
  { id: 'dk', name: 'Denmark', iso: 'dk' },
  { id: 'th', name: 'Thailand', iso: 'th' },
  { id: 'vn', name: 'Vietnam', iso: 'vn' },
  { id: 'id', name: 'Indonesia', iso: 'id' },
  { id: 'ma', name: 'Morocco', iso: 'ma' },
  { id: 'ke', name: 'Kenya', iso: 'ke' },
  { id: 'ng', name: 'Nigeria', iso: 'ng' },
  { id: 'co', name: 'Colombia', iso: 'co' },
  { id: 'pe', name: 'Peru', iso: 'pe' },
  { id: 'cl', name: 'Chile', iso: 'cl' },
  { id: 'cu', name: 'Cuba', iso: 'cu' },
  { id: 'pt', name: 'Portugal', iso: 'pt' },
  { id: 'cz', name: 'Czechia', iso: 'cz' },
  { id: 'pl', name: 'Poland', iso: 'pl' },
  { id: 'hu', name: 'Hungary', iso: 'hu' },
  { id: 'at', name: 'Austria', iso: 'at' },
  { id: 'be', name: 'Belgium', iso: 'be' },
  { id: 'ie', name: 'Ireland', iso: 'ie' },
  { id: 'sa', name: 'Saudi Arabia', iso: 'sa' },
  { id: 'ae', name: 'UAE', iso: 'ae' },
  { id: 'ph', name: 'Philippines', iso: 'ph' },
  { id: 'my', name: 'Malaysia', iso: 'my' },
  { id: 'sg', name: 'Singapore', iso: 'sg' },
  { id: 'jm', name: 'Jamaica', iso: 'jm' },
  { id: 'is', name: 'Iceland', iso: 'is' },
  { id: 'ua', name: 'Ukraine', iso: 'ua' }
];

// Generates a deck purely matching Flags to Names based on pairCount (6, 8, 10, 15, or 18)
const generateDeck = (pairCount) => {
  const deck = [];
  
  // Shuffle DB and take the required number of countries
  const shuffledDb = [...COUNTRIES_DB].sort(() => 0.5 - Math.random());
  const selectedCountries = shuffledDb.slice(0, pairCount);

  selectedCountries.forEach(country => {
    deck.push({ uuid: `${country.id}-name-${Math.random()}`, countryId: country.id, type: 'name', value: country.name });
    deck.push({ uuid: `${country.id}-flag-${Math.random()}`, countryId: country.id, type: 'flag', value: `https://flagcdn.com/w160/${country.iso}.png` });
  });
  
  // Fisher-Yates Shuffle the final deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

export const useAtlasLogic = (pairCount = 8) => {
  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [turns, setTurns] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Determine win state
  const isWin = matchedIds.length > 0 && matchedIds.length === pairCount;

  // Timer Loop
  useEffect(() => {
    let timer;
    if (!isWin && cards.length > 0) {
      timer = setInterval(() => {
        setTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWin, cards.length]);

  // Initialize deck on mount or when pairCount changes
  useEffect(() => {
    setCards(generateDeck(pairCount));
    setFlippedIds([]);
    setMatchedIds([]);
    setTurns(0);
    setStreak(0);
    setTimeSeconds(0);
    setIsLocked(false);
  }, [pairCount]);

  const handleCardClick = useCallback((uuid, countryId) => {
    if (isLocked || flippedIds.includes(uuid) || matchedIds.includes(countryId)) {
      return;
    }
    setFlippedIds(prev => [...prev, uuid]);
  }, [isLocked, flippedIds, matchedIds]);

  // Handle Match Logic
  useEffect(() => {
    if (flippedIds.length === 2) {
      setIsLocked(true);
      setTurns(t => t + 1);

      const card1 = cards.find(c => c.uuid === flippedIds[0]);
      const card2 = cards.find(c => c.uuid === flippedIds[1]);

      if (card1 && card2 && card1.countryId === card2.countryId) {
        setMatchedIds(prev => [...prev, card1.countryId]);
        setStreak(s => s + 1);
        setFlippedIds([]);
        setIsLocked(false);
      } else {
        setStreak(0);
        setTimeout(() => {
          setFlippedIds([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [flippedIds, cards]);

  const resetGame = () => {
    setCards(generateDeck(pairCount));
    setFlippedIds([]);
    setMatchedIds([]);
    setTurns(0);
    setStreak(0);
    setTimeSeconds(0);
    setIsLocked(false);
  };

  // Grade Calculation Algorithm
  // Tries to reward speed and minimum turns
  const getGrade = () => {
    if (!isWin) return '?';
    
    // Ideal turns = pairCount
    // A perfect game involves 0 mistakes, so turns === pairCount
    const excessTurns = Math.max(0, turns - pairCount);
    
    // Give them ~3s per pair for an 'S' rank
    const PAR_TIME = pairCount * 3.5;
    const excessTime = Math.max(0, timeSeconds - PAR_TIME);

    // Arbitrary strictness curve
    const scorePenalty = (excessTurns * 2) + excessTime;

    if (scorePenalty <= pairCount * 0.5) return 'S';
    if (scorePenalty <= pairCount * 1.5) return 'A';
    if (scorePenalty <= pairCount * 3) return 'B';
    if (scorePenalty <= pairCount * 5) return 'C';
    return 'D';
  };

  return { 
    cards, 
    flippedIds, 
    matchedIds, 
    turns, 
    streak, 
    timeSeconds, 
    isWin, 
    isLocked,
    grade: getGrade(),
    handleCardClick, 
    resetGame 
  };
};
