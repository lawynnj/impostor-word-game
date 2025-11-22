import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import "./App.css";
import { WORD_PAIRS } from "./wordPairs";
import ConfirmationModal from "./ConfirmationModal";

const ROLES = {
  CIVILIAN: "CIVILIAN",
  IMPOSTOR: "IMPOSTOR",
};

// --- Category helpers ---------------------------------------------------------
const CATEGORY_DISPLAY_NAMES = {
  food: "Food",
  location: "Locations",
  sports: "Sports",
  animals: "Animals",
  object: "Objects",
  movies: "Movies",
};

const getAllCategories = () => {
  const categories = [...new Set(WORD_PAIRS.map((pair) => pair.category))];
  return categories;
};

const getWordCountForCategory = (category) => {
  return WORD_PAIRS.filter((pair) => pair.category === category).length;
};

// --- Helper UI --------------------------------------------------------------
const SectionTitle = ({ children }) => (
  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
    {children}
  </h1>
);

const SubText = ({ children }) => (
  <p className="text-[#B3B3C0] text-sm sm:text-base">{children}</p>
);

const Card = ({ children, className = "" }) => (
  <div className={`max-w-xl mx-auto rounded-2xl p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

// --- Animated Dots Component --------------------------------------------------
const AnimatedDots = ({ containerRef }) => {
  const dotsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [dots, setDots] = useState([]);

  const colors = [
    "#8A8AAB", // muted purple-gray
    "#765D82", // muted purple
    "#7C9AA0", // muted teal
    "#89C2D0", // muted sky blue
    "#707585", // muted blue-gray
    "#9A8FA8", // muted lavender-gray
    "#6B7B8C", // muted slate blue
    "#8B9BA8", // muted blue-gray
    "#7D8A95", // muted gray-blue
    "#9B9FB5", // muted periwinkle
    "#6E7B8A", // muted steel blue
    "#8A95A3", // muted blue-gray
  ];

  // Initialize dots with positions and velocities
  useEffect(() => {
    const dotCount = 80;
    const initialDots = Array.from({ length: dotCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3, // velocity x
      vy: (Math.random() - 0.5) * 0.3, // velocity y
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    }));

    dotsRef.current = initialDots;
    setDots(initialDots);

    // Animation loop
    const animate = () => {
      if (!containerRef?.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      dotsRef.current.forEach((dot) => {
        // Update position (in percentage)
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Calculate actual pixel positions (accounting for dot size)
        const dotSizePx = dot.size;
        const maxX = 100 - (dotSizePx / containerWidth) * 100;
        const maxY = 100 - (dotSizePx / containerHeight) * 100;

        // Bounce off horizontal borders
        if (dot.x <= 0 || dot.x >= maxX) {
          dot.vx *= -1;
          dot.x = Math.max(0, Math.min(maxX, dot.x));
        }

        // Bounce off vertical borders
        if (dot.y <= 0 || dot.y >= maxY) {
          dot.vy *= -1;
          dot.y = Math.max(0, Math.min(maxY, dot.y));
        }
      });

      // Update DOM elements directly for performance
      dotsRef.current.forEach((dot) => {
        const element = document.getElementById(`dot-${dot.id}`);
        if (element) {
          // Convert percentage to pixels for translate3d
          // translate3d percentages are relative to element size, so we need pixels
          const xPx = (dot.x / 100) * containerWidth;
          const yPx = (dot.y / 100) * containerHeight;
          element.style.transform = `translate3d(${xPx}px, ${yPx}px, 0)`;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [containerRef]);

  return (
    <>
      {dots.map((dot) => {
        // Calculate initial pixel positions (will be updated by animation loop)
        // We need containerRef to get dimensions, but on first render it might not be available
        // So we'll use a placeholder that will be immediately updated by the animation loop
        const initialX =
          (dot.x / 100) *
          (containerRef?.current?.getBoundingClientRect().width || 100);
        const initialY =
          (dot.y / 100) *
          (containerRef?.current?.getBoundingClientRect().height || 100);

        return (
          <div
            key={dot.id}
            id={`dot-${dot.id}`}
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              backgroundColor: dot.color,
              transform: `translate3d(${initialX}px, ${initialY}px, 0)`,
              willChange: "transform",
            }}
          />
        );
      })}
    </>
  );
};

// Load settings from localStorage helper
const loadSettingsFromStorage = () => {
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
  const revealContainerRef = useRef(null);

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

  const handleToggleCategory = (category) => {
    setEnabledCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleBackToConfig = () => {
    // If no categories are enabled, reset to all categories
    if (enabledCategories.size === 0) {
      setEnabledCategories(new Set(getAllCategories()));
    }
    navigate("/");
  };

  const handlePlayerCountChange = (delta) => {
    const newCount = playerCount + delta;
    if (newCount >= MIN && newCount <= MAX) {
      setPlayerCount(newCount);
      // Ensure impostor count doesn't exceed new player count
      if (impostorCount >= newCount) {
        setImpostorCount(Math.max(1, newCount - 1));
      }
    }
  };

  const handleImpostorCountChange = (delta) => {
    const newCount = impostorCount + delta;
    const maxImpostors = playerCount - 1;
    if (newCount >= 1 && newCount <= maxImpostors) {
      setImpostorCount(newCount);
    }
  };

  // --- Screens --------------------------------------------------------------
  const renderCategorySelection = () => {
    const allCategories = getAllCategories();

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleBackToConfig}
            aria-label="Back"
            className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white ring-1 ring-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10.03 3.97a.75.75 0 0 1 0 1.06L4.81 10.25H21a.75.75 0 0 1 0 1.5H4.81l5.22 5.22a.75.75 0 1 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-semibold">Category Selection</h1>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          {allCategories.map((category) => {
            const isActive = enabledCategories.has(category);
            const wordCount = getWordCountForCategory(category);
            const displayName = CATEGORY_DISPLAY_NAMES[category];

            return (
              <button
                key={category}
                onClick={() => handleToggleCategory(category)}
                className={`rounded-2xl p-4 text-left transition-all ${
                  isActive
                    ? "bg-[#3B82F6] border-2 border-[#60A5FA]"
                    : "bg-[#151530] border-2 border-[#FACC15]"
                } hover:scale-[1.02] active:scale-[.98]`}
              >
                <div className="text-white font-semibold text-lg mb-2">
                  {displayName}
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-[#60A5FA]" : "bg-[#FACC15]"
                    }`}
                  />
                  <span>{wordCount} words</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPlayerCountSelection = () => {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigate("/")}
            aria-label="Back"
            className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white ring-1 ring-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10.03 3.97a.75.75 0 0 1 0 1.06L4.81 10.25H21a.75.75 0 0 1 0 1.5H4.81l5.22 5.22a.75.75 0 1 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-semibold">Players</h1>
        </div>

        {/* Player Count Display and Controls */}
        <div className="mt-8 flex flex-col items-center border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-[12px] mb-4">
            How many players?
          </div>
          <div className="text-white text-7xl font-bold mb-8">
            {playerCount}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handlePlayerCountChange(-1)}
              disabled={playerCount <= MIN}
              className="w-14 h-14 rounded-full bg-[#2A2540] text-white flex items-center justify-center hover:bg-[#332B4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePlayerCountChange(1)}
              disabled={playerCount >= MAX}
              className="w-14 h-14 rounded-full bg-[#2A2540] text-white flex items-center justify-center hover:bg-[#332B4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderImpostorCountSelection = () => {
    const maxImpostors = playerCount - 1;
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigate("/")}
            aria-label="Back"
            className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white ring-1 ring-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10.03 3.97a.75.75 0 0 1 0 1.06L4.81 10.25H21a.75.75 0 0 1 0 1.5H4.81l5.22 5.22a.75.75 0 1 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-semibold">Impostors</h1>
        </div>

        {/* Impostor Count Display and Controls */}
        <div className="mt-8 flex flex-col items-center border border-white/10 rounded-2xl p-6">
          <div className="text-white/60 text-sm mb-4">How many imposters?</div>
          <div className="text-white text-7xl font-bold mb-8">
            {impostorCount}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleImpostorCountChange(-1)}
              disabled={impostorCount <= 1}
              className="w-14 h-14 rounded-full bg-[#2A2540] text-white flex items-center justify-center hover:bg-[#332B4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handleImpostorCountChange(1)}
              disabled={impostorCount >= maxImpostors}
              className="w-14 h-14 rounded-full bg-[#2A2540] text-white flex items-center justify-center hover:bg-[#332B4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfig = () => {
    const allCategories = getAllCategories();
    const isAllCategoriesSelected =
      enabledCategories.size === allCategories.length;
    const categoryDisplayText = isAllCategoriesSelected
      ? "All Categories"
      : Array.from(enabledCategories)
          .map((cat) => CATEGORY_DISPLAY_NAMES[cat])
          .join(", ");

    return (
      <div className="max-w-2xl mx-auto">
        {/* Player and Impostor Count Cards */}
        <h1 className="text-3xl font-semibold mb-6">Game Settings</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Player Count Card */}
          <button
            onClick={() => navigate("/players")}
            className="bg-[#2A2540] rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[#332B4A] transition-colors border-2 border-purple-500/40"
          >
            {/* Icon Container */}
            <div className="bg-linear-to-r from-[#9333EA] to-[#A855F7]  rounded-xl p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white"
              >
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003c0 .597-.229 1.17-.64 1.591l-.78.78c-.063.063-.143.138-.23.23H3.15c-.087-.092-.167-.167-.23-.23l-.78-.78a2.25 2.25 0 0 1-.64-1.591v-.003ZM17.25 19.125l-.001.144a2.25 2.25 0 0 1-.233 1.027l-1.087 1.087a2.236 2.236 0 0 1-1.58.622H7.5a2.236 2.236 0 0 1-1.581-.622l-1.087-1.087a2.25 2.25 0 0 1-.233-1.027L5.25 19.125h12Z" />
              </svg>
            </div>
            {/* Question Text */}

            <div className="text-white/60 text-[12px] mb-4">
              How many players?
            </div>
            {/* Large Number */}
            <div className="text-white text-3xl font-bold">{playerCount}</div>
          </button>

          {/* Impostor Count Card */}
          <button
            onClick={() => navigate("/impostors")}
            className="bg-[#2A2540] rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[#332B4A] transition-colors border-2 border-purple-500/40"
          >
            {/* Icon Container */}
            <div className="bg-linear-to-r from-[#9333EA] to-[#A855F7] rounded-xl p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* Question Text */}

            <div className="text-white/60 text-[12px]">How many imposters?</div>
            {/* Large Number */}
            <div className="text-white text-3xl font-bold">{impostorCount}</div>
          </button>
        </div>
        {/* Categories Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" className="w-5 h-5">
            <path d="M120 120h120v120H120zM0 240h120v120H0zM120 360h120v120H120zM0 0h120v120H0zM360 120h120v120H360zM240 240h120v120H240zM360 360h120v120H360zM240 0h120v120H240z" 
            fill="#A855F7"></path></svg>
            <label className="font-medium text-white">Categories</label>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="w-full bg-[#2A2540] rounded-xl p-4 flex items-center justify-between hover:bg-[#332B4A] transition-colors"
          >
            <div className="text-left">
              <div className="text-white font-medium">
                {categoryDisplayText}
              </div>
              {isAllCategoriesSelected && (
                <div className="text-white/60 text-sm mt-1">
                  {allCategories.length} categories enabled
                </div>
              )}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-white"
            >
              <path
                fillRule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {/* Toggle Settings */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path fill="#A855F7"  d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                <path fill="#A855F7" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
              </svg>
              <label htmlFor="displayCategory" className="font-medium text-white">
                Show Category to Imposter
            </label>
            </div>
            <button
              id="displayCategory"
              type="button"
              role="switch"
              aria-checked={displayCategory}
              onClick={() => setDisplayCategory(!displayCategory)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#0B0C24] ${
                displayCategory ? "bg-[#A855F7]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  displayCategory ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" className="w-5 h-5 text-white" fill="currentColor"><g data-name="Lamp Bulb">
                <path fill="#A855F7" d="M44 13a15 15 0 1 0 15 15 15.016 15.016 0 0 0-15-15zm0 28a13 13 0 1 1 13-13 13.015 13.015 0 0 1-13 13z"/>
                <path fill="#A855F7" d="M44 9a19 19 0 1 0 19 19A19.022 19.022 0 0 0 44 9zm0 36a17 17 0 1 1 17-17 17.019 17.019 0 0 1-17 17z"/>
                <path fill="#A855F7" d="M47 24a1 1 0 0 0 2 0 4.004 4.004 0 0 0-4-4v-1a1 1 0 0 0-2 0v1a4.004 4.004 0 0 0-4 4v.145a3.979 3.979 0 0 0 2.21 3.579l1.79.894V34a2.003 2.003 0 0 1-2-2 1 1 0 0 0-2 0 4.004 4.004 0 0 0 4 4v1a1 1 0 0 0 2 0v-1a4.004 4.004 0 0 0 4-4v-.145a3.979 3.979 0 0 0-2.21-3.579L45 27.382V22a2.003 2.003 0 0 1 2 2zm-1.105 6.065A1.99 1.99 0 0 1 47 31.855V32a2.003 2.003 0 0 1-2 2v-4.382zM43 26.382l-.894-.447A1.99 1.99 0 0 1 41 24.145V24a2.003 2.003 0 0 1 2-2z"/>
                <path fill="#A855F7" d="M44 1a28.003 28.003 0 0 0-15 51.648v4.494a3.984 3.984 0 0 0-2.313 6.097 3.975 3.975 0 0 0 0 7.522A3.998 3.998 0 0 0 30 77h6v2a8 8 0 0 0 16 0v-2h6a3.998 3.998 0 0 0 3.313-6.24 3.975 3.975 0 0 0 0-7.52A3.984 3.984 0 0 0 59 57.141v-4.495A28.003 28.003 0 0 0 44 1zm6 78a6 6 0 0 1-12 0v-2h12zm8-4H30a2 2 0 0 1 0-4h28a2 2 0 0 1 0 4zm4-8a2.003 2.003 0 0 1-2 2H28a2 2 0 0 1 0-4h32a2.003 2.003 0 0 1 2 2zm-2-6a2.003 2.003 0 0 1-2 2H30a2 2 0 0 1 0-4h28a2.003 2.003 0 0 1 2 2zm-2.52-9.763a1 1 0 0 0-.48.855V57H31v-4.908a1 1 0 0 0-.48-.855 26 26 0 1 1 26.961 0z"/>
                <path fill="#A855F7" d="M85 27h-9a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zM76.625 22.781l5-4a1 1 0 1 0-1.25-1.562l-5 4a1 1 0 0 0 1.25 1.562zM76.625 33.219a1 1 0 0 0-1.25 1.562l5 4a1 1 0 1 0 1.25-1.562zM12 27H3a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zM11.375 22.781a1 1 0 1 0 1.25-1.562l-5-4a1 1 0 0 0-1.25 1.562zM11.375 33.219l-5 4a1 1 0 0 0 1.25 1.562l5-4a1 1 0 1 0-1.25-1.562z"/>
                </g></svg>
              <label
                htmlFor="displayImpostorHint"
                className="font-medium text-white"
              >
                Show Hint to Imposter
              </label>
            </div>
            <button
              id="displayImpostorHint"
              type="button"
              role="switch"
              aria-checked={displayImpostorHint}
              onClick={() => setDisplayImpostorHint(!displayImpostorHint)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#0B0C24] ${
                displayImpostorHint ? "bg-[#A855F7]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  displayImpostorHint ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
        {/* Start Game Button */}
        <button
          onClick={startGame}
          className="w-full bg-linear-to-r from-[#9333EA] to-[#581C87] rounded-xl py-4 px-6 text-white font-medium hover:opacity-90 active:scale-[.99] transition-all"
        >
          Start Game
        </button>
      </div>
    );
  };

  const renderPlayers = () => (
    <div className="max-w-2xl mx-auto">
      {/* Header with back (mapped to New Game confirm) */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handleNewGameConfirm}
          aria-label="Back"
          className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white ring-1 ring-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M10.03 3.97a.75.75 0 0 1 0 1.06L4.81 10.25H21a.75.75 0 0 1 0 1.5H4.81l5.22 5.22a.75.75 0 1 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-semibold">Players</h1>
      </div>
      <p className="text-[#B3B3C0] mb-5">
        Tap your name to reveal your word, then pass the device to the next
        player.
      </p>

      {/* Grid of player tiles */}
      <div className="grid grid-cols-2 gap-4">
        {players.map((p, i) => {
          const disabled = p.revealed;
          return (
            <button
              key={p.index}
              disabled={disabled}
              onClick={() => handlePickPlayer(i)}
              className={`group relative rounded-3xl p-0.5 transition ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:scale-[1.01] active:scale-[.99]"
              } bg-[conic-gradient(at_right,#3B82F6,#8B5CF6,#A855F7)]`}
            >
              <div className="rounded-3xl h-full w-full bg-[#0B0C24] p-4">
                <div className="flex h-full flex-col items-center justify-center">
                  {/* Avatar with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl opacity-60 bg-linear-to-br from-[#3B82F6] to-[#A855F7]" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full text-white bg-linear-to-br from-[#3B82F6] to-[#A855F7] shadow-inner">
                      <span className="text-xl font-semibold">P</span>
                    </div>
                  </div>
                  <div className="mt-3 text-lg font-medium">
                    Player {p.index}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer row */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-[#B3B3C0]">
          Revealed: {revealedCount}/{players.length}
        </span>
      </div>
    </div>
  );

  const renderReveal = (playerIndex, showing, setShowing) => {
    if (playerIndex == null || !players[playerIndex]) return null;
    const p = players[playerIndex];
    const isImpostor = p.role === ROLES.IMPOSTOR;

    const handleTapBlackBox = () => setShowing(true);

    return (
      <Card className="text-center">
        <div className="text-center">
          <h1 className="text-sm sm:text-base">
            <span className="text-[#B3B3C0]">The word for </span>
            <span className="text-[#A855F7] font-semibold">
              Player {p.index}
            </span>
          </h1>
          {displayCategory && category && (
            <SectionTitle>
              Category: <span className="capitalize">{category}</span>
            </SectionTitle>
          )}
        </div>

        <div
          ref={revealContainerRef}
          role="button"
          tabIndex={0}
          aria-label="Tap to reveal"
          onClick={handleTapBlackBox}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleTapBlackBox()
          }
          className={`mt-6 flex h-56 w-full select-none items-center justify-center rounded-2xl relative overflow-hidden ${
            showing && isImpostor ? "p-0.5" : ""
          }`}
          style={{
            backgroundColor: showing && isImpostor ? "#FF0000" : "#151530",
            boxShadow:
              showing && isImpostor
                ? "0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.3)"
                : "none",
          }}
        >
          {showing && isImpostor ? (
            <>
              <div
                className="absolute inset-0.5 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#0a0a15" }}
              >
                <div className="px-4 text-center z-10">
                  <div
                    className="text-4xl sm:text-5xl font-bold"
                    style={{ color: "#FF0000" }}
                  >
                    Impostor
                  </div>
                </div>
              </div>
            </>
          ) : !showing ? (
            <div className="absolute inset-0">
              <AnimatedDots containerRef={revealContainerRef} />
            </div>
          ) : (
            <div className="px-4 text-center z-10">
              <div
                className="text-4xl sm:text-5xl font-bold"
                style={{
                  color: "#00FFFF",
                  textShadow:
                    "0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)",
                }}
              >
                {secretWord}
              </div>
            </div>
          )}
        </div>

        {!showing ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-[#03BFFF]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
            </svg>
            <span className="text-sm sm:text-base">Tap the box to reveal</span>
          </div>
        ) : isImpostor && displayImpostorHint ? (
          <>
            {/* Clue Card */}
            <div
              className="mt-6 rounded-2xl p-5 text-center"
              style={{ backgroundColor: "#210919", border: "1px solid #22F37" }}
            >
              <div
                className="flex items-center justify-center gap-2 mb-4"
                style={{ color: "#FBBF24" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
                </svg>
                <span className="font-semibold">Your Clue</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white uppercase mb-2">
                {impostorHint}
              </div>
              <div className="text-sm text-white/80">
                Use this in the first round to blend in!
              </div>
            </div>
          </>
        ) : null}

        <button
          onClick={() => handleGotIt(playerIndex)}
          disabled={!showing}
          className={`mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium transition ${
            showing
              ? "bg-linear-to-r from-[#9333EA] to-[#A855F7] text-white hover:opacity-90"
              : "bg-white/30 text-white/60 cursor-not-allowed"
          }`}
        >
          Got it!
        </button>
      </Card>
    );
  };

  const renderVotingPhase = () => {
    const starterIdx = startingPlayerIndex != null ? startingPlayerIndex : 0;
    const starterLabel = `Player ${starterIdx + 1}`;

    return (
      <div className="max-w-2xl mx-auto grid gap-4">
        {/* Header */}
        <div className="px-2">
          <h1 className="text-3xl font-semibold">Voting Phase</h1>
          <p className="text-[#B3B3C0] mt-1">Time to discuss and vote…</p>
        </div>

        {/* Cards */}
        <div className="grid gap-3">
          {/* Card 1: Starting Player */}
          <div
            className="rounded-2xl p-4 text-white"
            style={{ backgroundColor: "#0D284F" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: "#007BFF" }}
              />
              <div>
                <div className="font-semibold">1. Starting Player</div>
                <ul className="mt-1 list-disc pl-5 text-sm text-white/90">
                  <li>{starterLabel} begins the round.</li>
                  <li>This sets the order for who speaks first.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Group Discussion */}
          <div
            className="rounded-2xl p-4 text-white"
            style={{ backgroundColor: "#2E1A45" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: "#8B5CF6" }}
              />
              <div>
                <div className="font-semibold">2. Group Discussion</div>
                <ul className="mt-1 list-disc pl-5 text-sm text-white/90">
                  <li>Players take turns clockwise discussing clues.</li>
                  <li>
                    The goal: expose inconsistencies or hints that identify the
                    impostor.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Vote Time */}
          <div
            className="rounded-2xl p-4 text-white"
            style={{ backgroundColor: "#3B2E1C" }}
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8" style={{ backgroundColor: "#FACC15" }} />
              <div>
                <div className="font-semibold">3. Vote Time</div>
                <ul className="mt-1 list-disc pl-5 text-sm text-white/90">
                  <li>
                    Each player says a word related to the secret (the clue
                    word).
                  </li>
                  <li>
                    The group may repeat this 2–3 times to gather more context.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 4: Reveal Phase */}
          <div
            className="rounded-2xl p-4 text-white"
            style={{ backgroundColor: "#3A1C26" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              />
              <div>
                <div className="font-semibold">4. Reveal Phase</div>
                <ul className="mt-1 list-disc pl-5 text-sm text-white/90">
                  <li>Everyone votes for who they think the impostor is.</li>
                  <li>
                    After all votes are in, tap <em>Reveal Results</em> to see
                    who was the impostor.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-2">
          <button
            onClick={handleRevealResults}
            className="inline-flex items-center justify-center rounded-xl border border-red-800 bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-600 active:scale-[.99]"
          >
            Reveal Results
          </button>
          <button
            onClick={handleNewGameConfirm}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/15"
          >
            New Game
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const impostorLabels =
      impostorIndices.length > 0
        ? impostorIndices.map((idx) => `Player ${idx + 1}`).join(", ")
        : "Unknown";
    return (
      <Card className="text-center">
        <SectionTitle>Results</SectionTitle>
        <p className="mt-2 text-lg">
          The {impostorIndices.length === 1 ? "impostor was" : "impostors were"}
          : <span className="font-semibold">{impostorLabels}</span>
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={handleNewGameConfirm}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/15"
          >
            New Game
          </button>
        </div>
      </Card>
    );
  };

  // --- Route Components ------------------------------------------------------
  const ConfigRoute = () => renderConfig();
  const CategorySelectionRoute = () => renderCategorySelection();
  const PlayerCountSelectionRoute = () => renderPlayerCountSelection();
  const ImpostorCountSelectionRoute = () => renderImpostorCountSelection();
  const PlayersRoute = () => renderPlayers();

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

    return renderReveal(playerIndex, showing, setShowing);
  };

  const VotingRoute = () => renderVotingPhase();
  const ResultsRoute = () => renderResults();

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
      className="min-h-screen w-full px-4 py-6 text-white"
      style={{ backgroundColor: "#0B0C24" }}
    >
      <Routes>
        <Route path="/" element={<ConfigRoute />} />
        <Route path="/categories" element={<CategorySelectionRoute />} />
        <Route path="/players" element={<PlayerCountSelectionRoute />} />
        <Route path="/impostors" element={<ImpostorCountSelectionRoute />} />
        <Route path="/game" element={<PlayersRoute />} />
        <Route path="/reveal/:playerIndex" element={<RevealRoute />} />
        <Route path="/voting" element={<VotingRoute />} />
        <Route path="/results" element={<ResultsRoute />} />
      </Routes>
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
