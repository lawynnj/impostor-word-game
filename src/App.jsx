import React, { useMemo, useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import "./App.css";
import { WORD_PAIRS } from "./wordPairs";
import ConfirmationModal from "./ConfirmationModal";
import { ROLES } from "./constants";
import { loadSettingsFromStorage } from "./utils";

// Screens
import ConfigScreen from "./screens/ConfigScreen";
import CategorySelection from "./screens/CategorySelection";
import PlayerCountSelection from "./screens/PlayerCountSelection";
import ImpostorCountSelection from "./screens/ImpostorCountSelection";
import GameScreen from "./screens/GameScreen";
import RevealScreen from "./screens/RevealScreen";
import VotingScreen from "./screens/VotingScreen";
import ResultsScreen from "./screens/ResultsScreen";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Config
  const MIN = 3;
  const MAX = 12;

  // Initialize settings from localStorage using lazy initialization
  // Load once and use for all settings
  const [playerCount, setPlayerCount] = useState(() => {
    const settings = loadSettingsFromStorage();
    return settings.playerCount;
  });
  // Display category
  const [displayCategory, setDisplayCategory] = useState(() => {
    const settings = loadSettingsFromStorage();
    return settings.displayCategory;
  });
  const [displayImpostorHint, setDisplayImpostorHint] = useState(() => {
    const settings = loadSettingsFromStorage();
    return settings.displayImpostorHint;
  });
  const [enabledCategories, setEnabledCategories] = useState(() => {
    const settings = loadSettingsFromStorage();
    return settings.enabledCategories;
  });
  const [impostorCount, setImpostorCount] = useState(() => {
    const settings = loadSettingsFromStorage();
    return settings.impostorCount;
  });

  // Core state
  const [players, setPlayers] = useState([]); // { index, role, revealed }
  const [impostorIndices, setImpostorIndices] = useState([]);
  const [secretWord, setSecretWord] = useState("");
  const [impostorHint, setImpostorHint] = useState("");
  const [category, setCategory] = useState("");

  // Flow state
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(null); // for Voting phase
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);

  // Derived
  const revealedCount = useMemo(
    () => players.reduce((acc, p) => acc + (p.revealed ? 1 : 0), 0),
    [players]
  );

  // Auto-advance to Voting when all players have revealed
  useEffect(() => {
    if (
      location.pathname === "/game" &&
      players.length > 0 &&
      revealedCount === players.length
    ) {
      const starter = Math.floor(Math.random() * players.length);
      setStartingPlayerIndex(starter);
      navigate("/voting");
    }
  }, [location.pathname, players, revealedCount, navigate]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("playerCount", JSON.stringify(playerCount));
  }, [playerCount]);

  useEffect(() => {
    localStorage.setItem("displayCategory", JSON.stringify(displayCategory));
  }, [displayCategory]);

  useEffect(() => {
    localStorage.setItem(
      "displayImpostorHint",
      JSON.stringify(displayImpostorHint)
    );
  }, [displayImpostorHint]);

  useEffect(() => {
    localStorage.setItem(
      "enabledCategories",
      JSON.stringify(Array.from(enabledCategories))
    );
  }, [enabledCategories]);

  useEffect(() => {
    localStorage.setItem("impostorCount", JSON.stringify(impostorCount));
  }, [impostorCount]);

  // --- Actions --------------------------------------------------------------
  const startGame = () => {
    if (playerCount < MIN || playerCount > MAX) {
      alert(`Player count must be between ${MIN} and ${MAX}.`);
      return;
    }

    if (impostorCount >= playerCount) {
      alert(`Number of impostors must be less than the number of players.`);
      return;
    }

    // Filter word pairs by enabled categories
    const availablePairs = WORD_PAIRS.filter((pair) =>
      enabledCategories.has(pair.category)
    );

    if (availablePairs.length === 0) {
      alert("Please enable at least one category.");
      return;
    }

    const pair =
      availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setSecretWord(pair.secret);
    setImpostorHint(pair.hint);
    setCategory(pair.category);

    const arr = Array.from({ length: playerCount }, (_, i) => ({
      index: i + 1,
      role: ROLES.CIVILIAN,
      revealed: false,
    }));

    // Select multiple impostors randomly
    const selectedIndices = [];
    while (selectedIndices.length < impostorCount) {
      const idx = Math.floor(Math.random() * playerCount);
      if (!selectedIndices.includes(idx)) {
        selectedIndices.push(idx);
        arr[idx].role = ROLES.IMPOSTOR;
      }
    }

    setPlayers(arr);
    setImpostorIndices(selectedIndices);
    setStartingPlayerIndex(null);
    navigate("/game");
  };

  const handlePickPlayer = (i) => {
    if (players[i].revealed) return;
    navigate(`/reveal/${i}`);
  };

  const handleGotIt = (playerIndex) => {
    if (playerIndex == null) return;

    setPlayers((prev) => {
      const next = [...prev];
      next[playerIndex] = { ...next[playerIndex], revealed: true };
      return next;
    });

    navigate("/game"); // effect will auto-advance to VOTING if all revealed
  };

  // Confirm new game (avoid accidental taps)
  const handleNewGameConfirm = () => {
    setIsNewGameModalOpen(true);
  };

  const confirmNewGame = () => {
    // Reset all game state
    setPlayers([]);
    setImpostorIndices([]);
    setSecretWord("");
    setImpostorHint("");
    setCategory("");
    setStartingPlayerIndex(null);
    setIsNewGameModalOpen(false);
    // Navigate to config screen
    navigate("/");
  };

  const cancelNewGame = () => {
    setIsNewGameModalOpen(false);
  };

  const handleRevealResults = () => navigate("/results");

  // --- Route Components ------------------------------------------------------

  const RevealRoute = () => {
    const { playerIndex: playerIndexParam } = useParams();
    const playerIndex = playerIndexParam
      ? parseInt(playerIndexParam, 10)
      : null;

    // Local state for showing - resets when route changes
    const [showing, setShowing] = useState(false);

    useEffect(() => {
      setShowing(false);
    }, [playerIndex]);

    return (
      <RevealScreen
        playerIndex={playerIndex}
        players={players}
        displayCategory={displayCategory}
        category={category}
        secretWord={secretWord}
        displayImpostorHint={displayImpostorHint}
        impostorHint={impostorHint}
        handleGotIt={handleGotIt}
        showing={showing}
        setShowing={setShowing}
      />
    );
  };

  // --- Prevent browser back exposing prior content --------------------------
  useEffect(() => {
    const onPop = () => {
      history.pushState(null, "", location.href);
    };
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div
      className="min-h-screen w-full px-4 py-6 text-white overflow-x-hidden"
      style={{ backgroundColor: "#0B0C24" }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ConfigScreen
                playerCount={playerCount}
                impostorCount={impostorCount}
                enabledCategories={enabledCategories}
                displayCategory={displayCategory}
                setDisplayCategory={setDisplayCategory}
                displayImpostorHint={displayImpostorHint}
                setDisplayImpostorHint={setDisplayImpostorHint}
                startGame={startGame}
                navigate={navigate}
              />
            }
          />
          <Route
            path="/categories"
            element={
              <CategorySelection
                enabledCategories={enabledCategories}
                setEnabledCategories={setEnabledCategories}
                navigate={navigate}
              />
            }
          />
          <Route
            path="/players"
            element={
              <PlayerCountSelection
                playerCount={playerCount}
                setPlayerCount={setPlayerCount}
                impostorCount={impostorCount}
                setImpostorCount={setImpostorCount}
                navigate={navigate}
              />
            }
          />
          <Route
            path="/impostors"
            element={
              <ImpostorCountSelection
                impostorCount={impostorCount}
                setImpostorCount={setImpostorCount}
                playerCount={playerCount}
                navigate={navigate}
              />
            }
          />
          <Route
            path="/game"
            element={
              <GameScreen
                players={players}
                handlePickPlayer={handlePickPlayer}
                revealedCount={revealedCount}
                handleNewGameConfirm={handleNewGameConfirm}
              />
            }
          />
          <Route path="/reveal/:playerIndex" element={<RevealRoute />} />
          <Route
            path="/voting"
            element={
              <VotingScreen
                startingPlayerIndex={startingPlayerIndex}
                handleRevealResults={handleRevealResults}
                handleNewGameConfirm={handleNewGameConfirm}
              />
            }
          />
          <Route
            path="/results"
            element={
              <ResultsScreen
                impostorIndices={impostorIndices}
                handleNewGameConfirm={handleNewGameConfirm}
              />
            }
          />
        </Routes>
      </AnimatePresence>
      {/* Global Modals */}
      <ConfirmationModal
        isOpen={isNewGameModalOpen}
        onConfirm={confirmNewGame}
        onCancel={cancelNewGame}
        title="Start New Game?"
        message="Are you sure you want to start a new game? This will reset all current progress."
      />
    </div>
  );
}
