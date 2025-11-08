import React, { useMemo, useState, useEffect } from "react";

import "./App.css";
// --- Game enums -------------------------------------------------------------
const STAGES = {
  CONFIG: "CONFIG",
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
  { secret: "Pizza", hint: "Food" },
  { secret: "Pineapple", hint: "Fruit" },
  { secret: "Canada", hint: "Country" },
  { secret: "Basketball", hint: "Sport" },
  { secret: "Elephant", hint: "Animal" },
  { secret: "Laptop", hint: "Electronics" },
  { secret: "Avatar", hint: "Movie" },
  { secret: "Twitter", hint: "App" },
  { secret: "Tesla", hint: "Car" },
  { secret: "Volcano", hint: "Nature" },
];

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
  <div
    className={`max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl ${className}`}
  >
    {children}
  </div>
);

export default function App() {
  const [stage, setStage] = useState(STAGES.CONFIG);

  // Config
  const MIN = 3;
  const MAX = 12;
  const [playerCount, setPlayerCount] = useState(6);

  // Core state
  const [players, setPlayers] = useState([]); // { index, role, revealed }
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [secretWord, setSecretWord] = useState("");
  const [impostorHint, setImpostorHint] = useState("");

  // Flow state
  const [activePlayerIndex, setActivePlayerIndex] = useState(null);
  const [showing, setShowing] = useState(false);
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(null); // for Voting phase

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

    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    setSecretWord(pair.secret);
    setImpostorHint(pair.hint);

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

  // --- Screens --------------------------------------------------------------
  const renderConfig = () => (
    <Card>
      <SectionTitle>Impostor Word Game</SectionTitle>
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

    // Generate random dots for the reveal box
    const generateDots = () => {
      const dots = [];
      const colors = [
        "#60A5FA", // light blue
        "#34D399", // light green
        "#F472B6", // light pink
        "#A78BFA", // light purple
        "#FFFFFF", // white
      ];
      for (let i = 0; i < 80; i++) {
        dots.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
        });
      }
      return dots;
    };

    const dots = generateDots();

    return (
      <Card className="text-center">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl">
            <span className="text-[#B3B3C0]">The word for </span>
            <span className="text-[#A855F7] font-semibold">
              Player {p.index}
            </span>
          </h1>
        </div>

        <div
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
            backgroundColor: showing && isImpostor ? "#FF0000" : "#1a1b2e",
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
              {dots.map((dot, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    backgroundColor: dot.color,
                  }}
                />
              ))}
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
          <div className="mt-6 flex items-center justify-center gap-2 text-[#60A5FA]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
            </svg>
            <span className="text-sm sm:text-base">Tap the box to reveal</span>
          </div>
        ) : isImpostor ? (
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
      {stage === STAGES.PLAYERS && renderPlayers()}
      {stage === STAGES.REVEAL && renderReveal()}
      {stage === STAGES.VOTING && renderVotingPhase()}
      {stage === STAGES.RESULTS && renderResults()}
    </div>
  );
}
