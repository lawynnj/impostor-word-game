import React from "react";

const VotingScreen = ({
    startingPlayerIndex,
    handleRevealResults,
    handleNewGameConfirm,
}) => {
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
                                    Each player says a word related to the secret (the clue word).
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
                                    After all votes are in, tap <em>Reveal Results</em> to see who
                                    was the impostor.
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

export default VotingScreen;
