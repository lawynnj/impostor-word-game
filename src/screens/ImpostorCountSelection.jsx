import React from "react";

const ImpostorCountSelection = ({
    impostorCount,
    setImpostorCount,
    playerCount,
    navigate,
}) => {
    const maxImpostors = playerCount - 1;

    const handleImpostorCountChange = (delta) => {
        const newCount = impostorCount + delta;
        if (newCount >= 1 && newCount <= maxImpostors) {
            setImpostorCount(newCount);
        }
    };

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

export default ImpostorCountSelection;
