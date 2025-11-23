import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { SectionTitle } from "../components/ui/SectionTitle";
import AnimatedDots from "../components/AnimatedDots";
import { ROLES } from "../constants";

const RevealScreen = ({
    players,
    displayCategory,
    category,
    secretWord,
    displayImpostorHint,
    impostorHint,
    handleGotIt,
}) => {
    const { playerIndex: playerIndexParam } = useParams();
    const playerIndex = playerIndexParam ? parseInt(playerIndexParam, 10) : null;
    const [showing, setShowing] = useState(false);

    useEffect(() => {
        setShowing(false);
    }, [playerIndex]);

    const revealContainerRef = useRef(null);

    if (playerIndex == null || !players[playerIndex]) return null;
    const p = players[playerIndex];
    const isImpostor = p.role === ROLES.IMPOSTOR;

    const handleTapBlackBox = () => setShowing(true);


    const disabled = true;
    const Component = disabled ? "div" : motion.div;
    const motionProps = disabled ? {} : {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
        transition: { duration: 0.3 }
    };

    return (
        <Component {...motionProps}>
            <Card className="text-center">
                <div className="text-center">
                    <h1 className="text-sm sm:text-base">
                        <span className="text-[#B3B3C0]">The word for </span>
                        <span className="text-[#A855F7] font-semibold">Player {p.index}</span>
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
                    className={`mt-6 flex h-56 w-full select-none items-center justify-center rounded-2xl relative overflow-hidden ${showing && isImpostor ? "p-0.5" : ""
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
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                    className={`mt-6 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium transition ${showing
                        ? "bg-linear-to-r from-[#9333EA] to-[#A855F7] text-white hover:opacity-90"
                        : "bg-white/30 text-white/60 cursor-not-allowed"
                        }`}
                >
                    Got it!
                </button>
            </Card>
        </Component>
    );
};

export default RevealScreen;
