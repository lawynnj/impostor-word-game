import React from "react";
import { CATEGORY_DISPLAY_NAMES } from "../constants";
import { getAllCategories } from "../utils";

const ConfigScreen = ({
    playerCount,
    impostorCount,
    enabledCategories,
    displayCategory,
    setDisplayCategory,
    displayImpostorHint,
    setDisplayImpostorHint,
    startGame,
    navigate,
}) => {
    const allCategories = getAllCategories();
    const isAllCategoriesSelected =
        enabledCategories.size === allCategories.length;
    const categoryDisplayText = isAllCategoriesSelected
        ? "All Categories"
        : Array.from(enabledCategories)
            .map((cat) => CATEGORY_DISPLAY_NAMES[cat])
            .join(", ");

    return (
        <div className="max-w-2xl mx-auto">
            {/* Player and Impostor Count Cards */}
            <h1 className="text-3xl font-semibold mb-6">Game Settings</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Player Count Card */}
                <button
                    onClick={() => navigate("/players")}
                    className="bg-[#2A2540] rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[#332B4A] transition-colors border-2 border-purple-500/40"
                >
                    {/* Icon Container */}
                    <div className="bg-linear-to-r from-[#9333EA] to-[#A855F7]  rounded-xl p-3 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8 text-white"
                        >
                            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003c0 .597-.229 1.17-.64 1.591l-.78.78c-.063.063-.143.138-.23.23H3.15c-.087-.092-.167-.167-.23-.23l-.78-.78a2.25 2.25 0 0 1-.64-1.591v-.003ZM17.25 19.125l-.001.144a2.25 2.25 0 0 1-.233 1.027l-1.087 1.087a2.236 2.236 0 0 1-1.58.622H7.5a2.236 2.236 0 0 1-1.581-.622l-1.087-1.087a2.25 2.25 0 0 1-.233-1.027L5.25 19.125h12Z" />
                        </svg>
                    </div>
                    {/* Question Text */}

                    <div className="text-white/60 text-[12px] mb-4">
                        How many players?
                    </div>
                    {/* Large Number */}
                    <div className="text-white text-3xl font-bold">{playerCount}</div>
                </button>

                {/* Impostor Count Card */}
                <button
                    onClick={() => navigate("/impostors")}
                    className="bg-[#2A2540] rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[#332B4A] transition-colors border-2 border-purple-500/40"
                >
                    {/* Icon Container */}
                    <div className="bg-linear-to-r from-[#9333EA] to-[#A855F7] rounded-xl p-3 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8 text-white"
                        >
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path
                                fillRule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    {/* Question Text */}

                    <div className="text-white/60 text-[12px]">How many imposters?</div>
                    {/* Large Number */}
                    <div className="text-white text-3xl font-bold">{impostorCount}</div>
                </button>
            </div>
            {/* Categories Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 480 480"
                        className="w-5 h-5"
                    >
                        <path
                            d="M120 120h120v120H120zM0 240h120v120H0zM120 360h120v120H120zM0 0h120v120H0zM360 120h120v120H360zM240 240h120v120H240zM360 360h120v120H360zM240 0h120v120H240z"
                            fill="#A855F7"
                        ></path>
                    </svg>
                    <label className="font-medium text-white">Categories</label>
                </div>
                <div className="flex flex-col rounded-2xl overflow-hidden border-2 border-purple-500/40 mb-3 divide-y divide-purple-500/40">
                    <button
                        onClick={() => navigate("/categories")}
                        className="w-full bg-[#2A2540] p-4 flex items-center justify-between hover:bg-[#332B4A] transition-colors"
                    >
                        <div className="text-left">
                            <div className="text-white font-medium">
                                {categoryDisplayText}
                            </div>
                            {isAllCategoriesSelected && (
                                <div className="text-white/60 text-sm mt-1">
                                    {allCategories.length} categories enabled
                                </div>
                            )}
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5 text-white"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div className="w-full bg-[#2A2540] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-eye"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill="#A855F7"
                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"
                                />
                                <path
                                    fill="#A855F7"
                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"
                                />
                            </svg>
                            <label
                                htmlFor="displayCategory"
                                className="font-medium text-white"
                            >
                                Show Category to Imposter
                            </label>
                        </div>
                        <button
                            id="displayCategory"
                            type="button"
                            role="switch"
                            aria-checked={displayCategory}
                            onClick={() => setDisplayCategory(!displayCategory)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#0B0C24] ${displayCategory ? "bg-[#A855F7]" : "bg-white/20"
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${displayCategory ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="w-full bg-[#2A2540] p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 88 88"
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                            >
                                <g data-name="Lamp Bulb">
                                    <path
                                        fill="#A855F7"
                                        d="M44 13a15 15 0 1 0 15 15 15.016 15.016 0 0 0-15-15zm0 28a13 13 0 1 1 13-13 13.015 13.015 0 0 1-13 13z"
                                    />
                                    <path
                                        fill="#A855F7"
                                        d="M44 9a19 19 0 1 0 19 19A19.022 19.022 0 0 0 44 9zm0 36a17 17 0 1 1 17-17 17.019 17.019 0 0 1-17 17z"
                                    />
                                    <path
                                        fill="#A855F7"
                                        d="M47 24a1 1 0 0 0 2 0 4.004 4.004 0 0 0-4-4v-1a1 1 0 0 0-2 0v1a4.004 4.004 0 0 0-4 4v.145a3.979 3.979 0 0 0 2.21 3.579l1.79.894V34a2.003 2.003 0 0 1-2-2 1 1 0 0 0-2 0 4.004 4.004 0 0 0 4 4v1a1 1 0 0 0 2 0v-1a4.004 4.004 0 0 0 4-4v-.145a3.979 3.979 0 0 0-2.21-3.579L45 27.382V22a2.003 2.003 0 0 1 2 2zm-1.105 6.065A1.99 1.99 0 0 1 47 31.855V32a2.003 2.003 0 0 1-2 2v-4.382zM43 26.382l-.894-.447A1.99 1.99 0 0 1 41 24.145V24a2.003 2.003 0 0 1 2-2z"
                                    />
                                    <path
                                        fill="#A855F7"
                                        d="M44 1a28.003 28.003 0 0 0-15 51.648v4.494a3.984 3.984 0 0 0-2.313 6.097 3.975 3.975 0 0 0 0 7.522A3.998 3.998 0 0 0 30 77h6v2a8 8 0 0 0 16 0v-2h6a3.998 3.998 0 0 0 3.313-6.24 3.975 3.975 0 0 0 0-7.52A3.984 3.984 0 0 0 59 57.141v-4.495A28.003 28.003 0 0 0 44 1zm6 78a6 6 0 0 1-12 0v-2h12zm8-4H30a2 2 0 0 1 0-4h28a2 2 0 0 1 0 4zm4-8a2.003 2.003 0 0 1-2 2H28a2 2 0 0 1 0-4h32a2.003 2.003 0 0 1 2 2zm-2-6a2.003 2.003 0 0 1-2 2H30a2 2 0 0 1 0-4h28a2.003 2.003 0 0 1 2 2zm-2.52-9.763a1 1 0 0 0-.48.855V57H31v-4.908a1 1 0 0 0-.48-.855 26 26 0 1 1 26.961 0z"
                                    />
                                    <path
                                        fill="#A855F7"
                                        d="M85 27h-9a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zM76.625 22.781l5-4a1 1 0 1 0-1.25-1.562l-5 4a1 1 0 0 0 1.25 1.562zM76.625 33.219a1 1 0 0 0-1.25 1.562l5 4a1 1 0 1 0 1.25-1.562zM12 27H3a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zM11.375 22.781a1 1 0 1 0 1.25-1.562l-5-4a1 1 0 0 0-1.25 1.562zM11.375 33.219l-5 4a1 1 0 0 0 1.25 1.562l5-4a1 1 0 1 0-1.25-1.562z"
                                    />
                                </g>
                            </svg>
                            <label
                                htmlFor="displayImpostorHint"
                                className="font-medium text-white"
                            >
                                Show Hint to Imposter
                            </label>
                        </div>
                        <button
                            id="displayImpostorHint"
                            type="button"
                            role="switch"
                            aria-checked={displayImpostorHint}
                            onClick={() => setDisplayImpostorHint(!displayImpostorHint)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#0B0C24] ${displayImpostorHint ? "bg-[#A855F7]" : "bg-white/20"
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${displayImpostorHint ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
                {/* Toggle Settings */}
            </div>

            {/* Start Game Button */}
            <button
                onClick={startGame}
                className="w-full bg-linear-to-r from-[#9333EA] to-[#581C87] rounded-xl py-4 px-6 text-white font-medium hover:opacity-90 active:scale-[.99] transition-all"
            >
                Start Game
            </button>
        </div>
    );
};

export default ConfigScreen;
