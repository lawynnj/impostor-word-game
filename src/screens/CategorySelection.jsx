import React from "react";
import { CATEGORY_DISPLAY_NAMES } from "../constants";
import { getAllCategories, getWordCountForCategory } from "../utils";

const CategorySelection = ({
    enabledCategories,
    setEnabledCategories,
    navigate,
}) => {
    const allCategories = getAllCategories();

    const handleToggleCategory = (category) => {
        setEnabledCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const handleBackToConfig = () => {
        // If no categories are enabled, reset to all categories
        if (enabledCategories.size === 0) {
            setEnabledCategories(new Set(getAllCategories()));
        }
        navigate("/");
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header with back button */}
            <div className="flex items-center gap-2 mb-2">
                <button
                    onClick={handleBackToConfig}
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
                <h1 className="text-3xl font-semibold">Category Selection</h1>
            </div>

            {/* Category cards grid */}
            <div className="grid grid-cols-2 gap-4 mt-5">
                {allCategories.map((category) => {
                    const isActive = enabledCategories.has(category);
                    const wordCount = getWordCountForCategory(category);
                    const displayName = CATEGORY_DISPLAY_NAMES[category];

                    return (
                        <button
                            key={category}
                            onClick={() => handleToggleCategory(category)}
                            className={`rounded-2xl p-4 text-left transition-all ${isActive
                                    ? "bg-[#3B82F6] border-2 border-[#60A5FA]"
                                    : "bg-[#151530] border-2 border-[#FACC15]"
                                } hover:scale-[1.02] active:scale-[.98]`}
                        >
                            <div className="text-white font-semibold text-lg mb-2">
                                {displayName}
                            </div>
                            <div className="flex items-center gap-2 text-white/90 text-sm">
                                <div
                                    className={`w-2 h-2 rounded-full ${isActive ? "bg-[#60A5FA]" : "bg-[#FACC15]"
                                        }`}
                                />
                                <span>{wordCount} words</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelection;
