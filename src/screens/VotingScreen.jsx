import React from "react";
import { motion } from "framer-motion";
import personIcon from "../assets/person-svgrepo-com.svg";
import groupIcon from "../assets/Group_of_users_silhouette.svg";
import voteIcon from "../assets/vote.svg";
import eyeIcon from "../assets/eye.svg";

const VotingScreen = ({
    startingPlayerIndex,
    handleRevealResults,
    handleNewGameConfirm,
}) => {
    const starterIdx = startingPlayerIndex != null ? startingPlayerIndex : 0;
    const starterLabel = `Player ${starterIdx + 1}`;

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
            className="max-w-2xl mx-auto grid gap-4"
            {...motionProps}
        >
            {/* Header */}
            <div className="px-2">
                <h1 className="text-3xl font-semibold">Voting Phase</h1>
                <p className="text-[#B3B3C0] mt-1">Time to discuss and vote…</p>
            </div>

            {/* Cards */}
            <div className="grid gap-3">
                {/* Card 1: Starting Player */}
                <div
                    className="rounded-2xl p-4 text-white border"
                    style={{ backgroundColor: "#0D284F", borderColor: "#007BFF" }}
                >
                    <div className="flex items-start gap-3">
                        <img src={personIcon} alt="Player" className="h-8 w-8" style={{ filter: "brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2534%) hue-rotate(198deg) brightness(102%) contrast(101%)" }} />
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
                    className="rounded-2xl p-4 text-white border"
                    style={{ backgroundColor: "#2E1A45", borderColor: "#8B5CF6" }}
                >
                    <div className="flex items-start gap-3">
                        <img src={groupIcon} alt="Player" className="h-8 w-8" style={{ filter: "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(242deg) brightness(101%) contrast(92%)" }} />
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
                    className="rounded-2xl p-4 text-white border"
                    style={{ backgroundColor: "#3B2E1C", borderColor: "#FACC15" }}
                >
                    <div className="flex items-start gap-3">
                        <img src={voteIcon} alt="Player" className="h-8 w-8" style={{ filter: "brightness(0) saturate(100%) invert(93%) sepia(61%) saturate(1195%) hue-rotate(327deg) brightness(103%) contrast(97%)" }} />
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
                    className="rounded-2xl p-4 text-white border"
                    style={{ backgroundColor: "#3A1C26", borderColor: "#EF4444" }}
                >
                    <div className="flex items-start gap-3">
                        <img src={eyeIcon} alt="Player" className="h-8 w-8" style={{ filter: "brightness(0) saturate(100%) invert(33%) sepia(93%) saturate(4841%) hue-rotate(349deg) brightness(96%) contrast(89%)" }} />
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
            <button
                onClick={handleRevealResults}
                className="w-full flex items-center justify-center rounded-xl px-4 py-3 font-medium text-white active:scale-[.99]"
                style={{
                    background: "linear-gradient(135deg, #960000, #c70000)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #760000, #960000)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #960000, #c70000)"}
            >
                Reveal Results
            </button>
        </Component>
    );
};

export default VotingScreen;

