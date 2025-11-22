import React from "react";

export const Card = ({ children, className = "" }) => (
    <div className={`max-w-xl mx-auto rounded-2xl p-5 shadow-xl ${className}`}>
        {children}
    </div>
);
