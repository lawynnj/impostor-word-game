import React, { useMemo, useState, useEffect, useRef } from "react";

import "./App.css";
// --- Game enums -------------------------------------------------------------
const STAGES = {
  CONFIG: "CONFIG",
  CATEGORY_SELECTION: "CATEGORY_SELECTION",
  PLAYERS: "PLAYERS",
  REVEAL: "REVEAL",
  VOTING: "VOTING",
  RESULTS: "RESULTS",
};

const ROLES = {
  CIVILIAN: "CIVILIAN",
  IMPOSTOR: "IMPOSTOR",
};

// --- Built-in word pairs (randomized at Start Game) -------------------------
const WORD_PAIRS = [
  // Food
  { secret: "Pizza", hint: "Food", category: "food" },
  { secret: "Pineapple", hint: "Fruit", category: "food" },
  { secret: "Sushi", hint: "Japanese dish", category: "food" },
  { secret: "Chocolate", hint: "Sweet treat", category: "food" },
  // Location
  { secret: "Canada", hint: "Country", category: "location" },
  { secret: "Volcano", hint: "Natural feature", category: "location" },
  { secret: "Paris", hint: "City", category: "location" },
  { secret: "Tokyo", hint: "Capital city", category: "location" },
  // Sports
  { secret: "Basketball", hint: "Sport", category: "sports" },
  { secret: "Soccer", hint: "Team sport", category: "sports" },
  { secret: "Tennis", hint: "Racket sport", category: "sports" },
  { secret: "Swimming", hint: "Water sport", category: "sports" },
  // Animals
  { secret: "Elephant", hint: "Animal", category: "animals" },
  { secret: "Lion", hint: "Big cat", category: "animals" },
  { secret: "Dolphin", hint: "Marine mammal", category: "animals" },
  { secret: "Penguin", hint: "Bird", category: "animals" },
  // Object
  { secret: "Laptop", hint: "Electronics", category: "object" },
  { secret: "Twitter", hint: "App", category: "object" },
  { secret: "Tesla", hint: "Car", category: "object" },
  { secret: "Watch", hint: "Timepiece", category: "object" },
  { secret: "Camera", hint: "Photography device", category: "object" },
  // Movies
  { secret: "Avatar", hint: "Movie", category: "movies" },
  { secret: "Titanic", hint: "Film", category: "movies" },
  { secret: "Inception", hint: "Sci-fi film", category: "movies" },
  { secret: "Frozen", hint: "Animated film", category: "movies" },
];

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

export default function App() {
  const [stage, setStage] = useState(STAGES.CONFIG);

  // Config
  const MIN = 3;
  const MAX = 12;
  const [playerCount, setPlayerCount] = useState(3);
  const [displayCategory, setDisplayCategory] = useState(false);
  const [displayImpostorHint, setDisplayImpostorHint] = useState(true);
  const [enabledCategories, setEnabledCategories] = useState(
    new Set(getAllCategories())
  );

  // Core state
  const [players, setPlayers] = useState([]); // { index, role, revealed }
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [secretWord, setSecretWord] = useState("");
  const [impostorHint, setImpostorHint] = useState("");
  const [category, setCategory] = useState("");

  // Flow state
  const [activePlayerIndex, setActivePlayerIndex] = useState(null);
  const [showing, setShowing] = useState(false);
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(null); // for Voting phase
  const revealContainerRef = useRef(null);

  // Derived
  const revealedCount = useMemo(
    () => players.reduce((acc, p) => acc + (p.revealed ? 1 : 0), 0),
    [players]
  );

  // Auto-advance to Voting when all players have revealed
  useEffect(() => {
    if (
      stage === STAGES.PLAYERS &&
      players.length > 0 &&
      revealedCount === players.length
    ) {
      const starter = Math.floor(Math.random() * players.length);
      setStartingPlayerIndex(starter);
      setStage(STAGES.VOTING);
    }
  }, [stage, players, revealedCount]);

  // --- Actions --------------------------------------------------------------
  const startGame = () => {
    if (playerCount < MIN || playerCount > MAX) {
      alert(`Player count must be between ${MIN} and ${MAX}.`);
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

    const impIdx = Math.floor(Math.random() * playerCount);
    arr[impIdx].role = ROLES.IMPOSTOR;

    setPlayers(arr);
    setImpostorIndex(impIdx);
    setActivePlayerIndex(null);
    setShowing(false);
    setStartingPlayerIndex(null);
    setStage(STAGES.PLAYERS);
  };

  const handlePickPlayer = (i) => {
    if (players[i].revealed) return;
    setActivePlayerIndex(i);
    setShowing(false);
    setStage(STAGES.REVEAL);
  };

  const handleTapBlackBox = () => setShowing(true);

  const handleGotIt = () => {
    if (activePlayerIndex == null) return;

    setPlayers((prev) => {
      const next = [...prev];
      next[activePlayerIndex] = { ...next[activePlayerIndex], revealed: true };
      return next;
    });

    setActivePlayerIndex(null);
    setShowing(false);
    setStage(STAGES.PLAYERS); // effect will auto-advance to VOTING if all revealed
  };

  // Confirm new game (avoid accidental taps)
  const handleNewGameConfirm = () => {
    const ok = window.confirm(
      "Start a new game? This will reset all progress."
    );
    if (ok) window.location.reload();
  };

  const handleRevealResults = () => setStage(STAGES.RESULTS);

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

  // --- Screens --------------------------------------------------------------
  const renderCategorySelection = () => {
    const allCategories = getAllCategories();

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setStage(STAGES.CONFIG)}
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

  const renderConfig = () => (
    <Card>
      <SectionTitle>Game Settings</SectionTitle>
      <div className="mt-1" />
      <SubText>
        Set the number of players and start a local pass-and-play round.
      </SubText>

      <div className="flex items-center gap-3 mt-5">
        <label htmlFor="playerCount" className="font-medium">
          Players
        </label>
        <input
          id="playerCount"
          type="number"
          min={MIN}
          max={MAX}
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
          className="w-24 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <span className="text-[#B3B3C0]">
          min {MIN}, max {MAX}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-5">
        <label htmlFor="displayCategory" className="font-medium">
          Display category
        </label>
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
      <div className="flex items-center gap-3 mt-5">
        <label htmlFor="displayImpostorHint" className="font-medium">
          Display hint to impostor
        </label>
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

      <div className="mt-5">
        <label className="font-medium block mb-2">Categories</label>
        <button
          onClick={() => setStage(STAGES.CATEGORY_SELECTION)}
          className="w-full text-left rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white hover:bg-white/15 transition-colors"
        >
          {Array.from(enabledCategories)
            .map((cat) => CATEGORY_DISPLAY_NAMES[cat])
            .join(", ") || "No categories selected"}
        </button>
      </div>

      <button
        onClick={startGame}
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 font-medium text-[#0B0C24] hover:bg-white/90 active:scale-[.99]"
      >
        Start Game
      </button>
    </Card>
  );

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

  const renderReveal = () => {
    if (activePlayerIndex == null) return null;
    const p = players[activePlayerIndex];
    const isImpostor = p.role === ROLES.IMPOSTOR;

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
          onClick={handleGotIt}
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
    const impostorLabel =
      impostorIndex != null ? `Player ${impostorIndex + 1}` : "Unknown";
    return (
      <Card className="text-center">
        <SectionTitle>Results</SectionTitle>
        <p className="mt-2 text-lg">
          The impostor was:{" "}
          <span className="font-semibold">{impostorLabel}</span>
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
      {stage === STAGES.CONFIG && renderConfig()}
      {stage === STAGES.CATEGORY_SELECTION && renderCategorySelection()}
      {stage === STAGES.PLAYERS && renderPlayers()}
      {stage === STAGES.REVEAL && renderReveal()}
      {stage === STAGES.VOTING && renderVotingPhase()}
      {stage === STAGES.RESULTS && renderResults()}
    </div>
  );
}
