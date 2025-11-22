import React from "react";
import { Card } from "../components/ui/Card";
import { SectionTitle } from "../components/ui/SectionTitle";

const ResultsScreen = ({ impostorIndices, handleNewGameConfirm }) => {
    const impostorLabels =
        impostorIndices.length > 0
            ? impostorIndices.map((idx) => `Player ${idx + 1}`).join(", ")
            : "Unknown";
    return (
        <Card className="text-center">
            <SectionTitle>Results</SectionTitle>
            <p className="mt-2 text-lg">
                The {impostorIndices.length === 1 ? "impostor was" : "impostors were"}:{" "}
                <span className="font-semibold">{impostorLabels}</span>
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

export default ResultsScreen;
