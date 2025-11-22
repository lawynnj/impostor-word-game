import React, { useRef, useState, useEffect } from "react";

const AnimatedDots = ({ containerRef }) => {
    const dotsRef = useRef([]);
    const animationFrameRef = useRef(null);
    const [dots, setDots] = useState([]);

    const colors = [
        "#8A8AAB", // muted purple-gray
        "#765D82", // muted purple
        "#7C9AA0", // muted teal
        "#89C2D0", // muted sky blue
        "#707585", // muted blue-gray
        "#9A8FA8", // muted lavender-gray
        "#6B7B8C", // muted slate blue
        "#8B9BA8", // muted blue-gray
        "#7D8A95", // muted gray-blue
        "#9B9FB5", // muted periwinkle
        "#6E7B8A", // muted steel blue
        "#8A95A3", // muted blue-gray
    ];

    // Initialize dots with positions and velocities
    useEffect(() => {
        const dotCount = 80;
        const initialDots = Array.from({ length: dotCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.3, // velocity x
            vy: (Math.random() - 0.5) * 0.3, // velocity y
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
        }));

        dotsRef.current = initialDots;
        setDots(initialDots);

        // Animation loop
        const animate = () => {
            if (!containerRef?.current) return;

            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const containerWidth = rect.width;
            const containerHeight = rect.height;

            dotsRef.current.forEach((dot) => {
                // Update position (in percentage)
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Calculate actual pixel positions (accounting for dot size)
                const dotSizePx = dot.size;
                const maxX = 100 - (dotSizePx / containerWidth) * 100;
                const maxY = 100 - (dotSizePx / containerHeight) * 100;

                // Bounce off horizontal borders
                if (dot.x <= 0 || dot.x >= maxX) {
                    dot.vx *= -1;
                    dot.x = Math.max(0, Math.min(maxX, dot.x));
                }

                // Bounce off vertical borders
                if (dot.y <= 0 || dot.y >= maxY) {
                    dot.vy *= -1;
                    dot.y = Math.max(0, Math.min(maxY, dot.y));
                }
            });

            // Update DOM elements directly for performance
            dotsRef.current.forEach((dot) => {
                const element = document.getElementById(`dot-${dot.id}`);
                if (element) {
                    // Convert percentage to pixels for translate3d
                    // translate3d percentages are relative to element size, so we need pixels
                    const xPx = (dot.x / 100) * containerWidth;
                    const yPx = (dot.y / 100) * containerHeight;
                    element.style.transform = `translate3d(${xPx}px, ${yPx}px, 0)`;
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [containerRef]);

    return (
        <>
            {dots.map((dot) => {
                // Calculate initial pixel positions (will be updated by animation loop)
                // We need containerRef to get dimensions, but on first render it might not be available
                // So we'll use a placeholder that will be immediately updated by the animation loop
                const initialX =
                    (dot.x / 100) *
                    (containerRef?.current?.getBoundingClientRect().width || 100);
                const initialY =
                    (dot.y / 100) *
                    (containerRef?.current?.getBoundingClientRect().height || 100);

                return (
                    <div
                        key={dot.id}
                        id={`dot-${dot.id}`}
                        className="absolute rounded-full"
                        style={{
                            left: 0,
                            top: 0,
                            width: `${dot.size}px`,
                            height: `${dot.size}px`,
                            backgroundColor: dot.color,
                            transform: `translate3d(${initialX}px, ${initialY}px, 0)`,
                            willChange: "transform",
                        }}
                    />
                );
            })}
        </>
    );
};

export default AnimatedDots;
