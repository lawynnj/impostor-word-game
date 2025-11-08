import React, { useMemo, useState, useEffect } from "react";

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

// --- Styles (inline for portability) ----------------------------------------
const card = {
  maxWidth: 560,
  margin: "24px auto",
  padding: 16,
  borderRadius: 16,
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  border: "1px solid #eaeaea",
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
};

const h1 = { fontSize: 28, margin: "0 0 8px" };
const h2 = { fontSize: 20, margin: "0 0 12px", opacity: 0.85 };
const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "white",
  cursor: "pointer",
};
const btnGhost = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "white",
  color: "#111",
  cursor: "pointer",
};
const listBtn = (disabled) => ({
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5e5e5",
  background: disabled ? "#f3f3f3" : "white",
  color: disabled ? "#999" : "#111",
  cursor: disabled ? "not-allowed" : "pointer",
});

const blackBox = {
  width: "100%",
  height: 220,
  borderRadius: 16,
  background: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#000", // keep text hidden until reveal
  userSelect: "none",
};

const revealText = { fontSize: 20, fontWeight: 600, textAlign: "center" };

// --- Main App ---------------------------------------------------------------
export default function App() {
  const [stage, setStage] = useState(STAGES.CONFIG);

  // Config
  const MIN = 3;
  const MAX = 12;
  const [playerCount, setPlayerCount] = useState(3);

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

  const handleRevealResults = () => setStage(STAGES.RESULTS);

  // Confirm new game (to avoid accidental taps)
  const handleNewGameConfirm = () => {
    const ok = window.confirm(
      "Start a new game? This will reset all progress."
    );
    if (ok) {
      window.location.reload();
    }
  };

  // --- Screens --------------------------------------------------------------
  const renderConfig = () => (
    <div style={card}>
      <h1 style={h1}>Impostor Word Game</h1>
      <h2 style={h2}>Configure players</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <label htmlFor="playerCount" style={{ fontWeight: 600 }}>
          Players:
        </label>
        <input
          id="playerCount"
          type="number"
          min={MIN}
          max={MAX}
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
          style={{
            padding: 8,
            width: 96,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
        <span style={{ opacity: 0.7 }}>
          min {MIN}, max {MAX}
        </span>
      </div>

      <button style={btn} onClick={startGame}>
        Start Game
      </button>
      <p style={{ marginTop: 12, opacity: 0.7 }}>
        Single-phone local play. Exactly one impostor.
      </p>
    </div>
  );

  const renderPlayers = () => (
    <div style={card}>
      <h1 style={h1}>Select the active player</h1>
      <p style={{ margin: "4px 0 16px", opacity: 0.75 }}>
        Pass the phone. The active player taps their number to privately reveal
        their role.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {players.map((p, i) => (
          <button
            key={p.index}
            style={listBtn(p.revealed)}
            disabled={p.revealed}
            onClick={() => handlePickPlayer(i)}
          >
            Player {p.index}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ opacity: 0.7 }}>
          Revealed: {revealedCount}/{players.length}
        </span>
        <button style={btnGhost} onClick={handleNewGameConfirm}>
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
      <div style={{ ...card, textAlign: "center" }}>
        <h1 style={h1}>Player {p.index}</h1>
        <p style={{ margin: "4px 0 16px", opacity: 0.75 }}>
          Tap the black box to reveal.
        </p>

        <div
          role="button"
          tabIndex={0}
          aria-label="Tap to reveal"
          onClick={handleTapBlackBox}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleTapBlackBox()
          }
          style={blackBox}
        >
          {!showing ? null : (
            <div style={{ color: "white", padding: 16 }}>
              <div style={revealText}>
                {isImpostor ? impostorHint : secretWord}
              </div>
              <div style={{ marginTop: 8, fontWeight: 500 }}>
                {isImpostor
                  ? "You are the Impostor. Blend in."
                  : "You are a Civilian."}
              </div>
            </div>
          )}
        </div>

        <button
          style={{ ...btn, marginTop: 16 }}
          onClick={handleGotIt}
          disabled={!showing}
        >
          Got it
        </button>

        <p style={{ marginTop: 12, opacity: 0.7 }}>
          Pass the phone to the next player after tapping “Got it”.
        </p>
      </div>
    );
  };

  const renderVotingPhase = () => {
    const starterIdx = startingPlayerIndex != null ? startingPlayerIndex : 0;
    const starterLabel = `Player ${starterIdx + 1}`;

    return (
      <div style={{ ...card }}>
        <h1 style={h1}>Voting Phase</h1>
        <p style={{ margin: "6px 0 12px", opacity: 0.8 }}>
          The app randomly picked a starting player for this round.
        </p>
        <div
          style={{
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <strong>Starting Player:</strong> {starterLabel}
        </div>

        <div style={{ lineHeight: 1.6 }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>
            🧩 Breakdown of Steps (How to Vote)
          </p>
          <ol style={{ paddingLeft: 18 }}>
            <li style={{ marginBottom: 10 }}>
              <strong>1. Starting Player</strong>
              <ul style={{ marginTop: 6 }}>
                <li>{starterLabel} begins the round.</li>
                <li>This sets the order for who speaks first.</li>
              </ul>
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>2. Group Discussion</strong>
              <ul style={{ marginTop: 6 }}>
                <li>Players take turns clockwise discussing clues.</li>
                <li>
                  The goal: expose inconsistencies or hints that identify the
                  impostor.
                </li>
              </ul>
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>3. Vote Time</strong>
              <ul style={{ marginTop: 6 }}>
                <li>
                  Each player says a word related to the secret (the clue word).
                </li>
                <li>
                  The group may repeat this 2–3 times to gather more context.
                </li>
              </ul>
            </li>
            <li>
              <strong>4. Reveal Phase</strong>
              <ul style={{ marginTop: 6 }}>
                <li>Everyone votes for who they think the impostor is.</li>
                <li>
                  After all votes are in, tap <em>Reveal Results</em> to see who
                  was the impostor.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button style={btn} onClick={handleRevealResults}>
            Reveal Results
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const impostorLabel =
      impostorIndex != null ? `Player ${impostorIndex + 1}` : "Unknown";
    return (
      <div style={{ ...card, textAlign: "center" }}>
        <h1 style={h1}>Results</h1>
        <p style={{ fontSize: 18, marginTop: 8 }}>
          The impostor was: <strong>{impostorLabel}</strong>
        </p>
        <div style={{ marginTop: 16 }}>
          <button style={btnGhost} onClick={() => window.location.reload()}>
            New Game
          </button>
        </div>
      </div>
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
    <div style={{ padding: 12 }}>
      {stage === STAGES.CONFIG && renderConfig()}
      {stage === STAGES.PLAYERS && renderPlayers()}
      {stage === STAGES.REVEAL && renderReveal()}
      {stage === STAGES.VOTING && renderVotingPhase()}
      {stage === STAGES.RESULTS && renderResults()}
    </div>
  );
}
