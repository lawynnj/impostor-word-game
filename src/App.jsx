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
              } bg-[conic-gradient(at_right,#3B82F6,#8B5CF6,#9333EA)]`}
            >
              <div className="rounded-3xl h-full w-full bg-white/5 ring-1 ring-white/10 p-4">
                <div className="flex h-full flex-col items-start justify-center">
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
        <button
          onClick={handleNewGameConfirm}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/15"
        >
          New Game
        </button>
      </div>
    </div>
  );

  const renderReveal = () => {
    if (activePlayerIndex == null) return null;
    const p = players[activePlayerIndex];
    const isImpostor = p.role === ROLES.IMPOSTOR;

    return (
      <Card className="text-center">
        <SectionTitle>Player {p.index}</SectionTitle>
        <div className="mt-1" />
        <SubText>Tap the black box to reveal.</SubText>

        <div
          role="button"
          tabIndex={0}
          aria-label="Tap to reveal"
          onClick={handleTapBlackBox}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleTapBlackBox()
          }
          className="mt-4 flex h-56 w-full select-none items-center justify-center rounded-2xl bg-black"
        >
          {!showing ? null : (
            <div className="px-4 text-center text-white">
              <div className="text-xl font-semibold">
                {isImpostor ? impostorHint : secretWord}
              </div>
              <div className="mt-2 font-medium">
                {isImpostor
                  ? "You are the Impostor. Blend in."
                  : "You are a Civilian."}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleGotIt}
          disabled={!showing}
          className={`mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition ${
            showing
              ? "bg-white text-[#0B0C24] hover:bg-white/90"
              : "bg-white/30 text-white/60 cursor-not-allowed"
          }`}
        >
          Got it
        </button>

        <SubText>
          Pass the phone to the next player after tapping “Got it”.
        </SubText>
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
