import React from "react";
import { motion } from "framer-motion";

const GameScreen = ({
    players,
    handlePickPlayer,
    revealedCount,
    handleNewGameConfirm,
}) => {

    const disabled = false;
    const Component = disabled ? "div" : motion.div;
    const motionProps = disabled ? {} : {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
        transition: { duration: 0.15 }
    };

    return (
        <Component
            className="max-w-2xl mx-auto"
            {...motionProps}
        >
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
                            className={`group relative rounded-3xl p-0.5 transition ${disabled
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
        </Component>
    );
};

export default GameScreen;
