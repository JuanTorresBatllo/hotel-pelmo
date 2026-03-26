"use client";

import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

interface AnimatedTextProps {
    text?: string;
    className?: string;
    onClick?: () => void;
    style?: CSSProperties;
}

function WaveText({
    text = "Hover me",
    className = "",
    onClick,
    style,
}: AnimatedTextProps) {
    return (
        <motion.span
            className={cn(
                "w-full text-center inline-block cursor-pointer text-3xl transition-all",
                className
            )}
            style={style}
            whileHover="hover"
            initial="initial"
            onClick={onClick}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                    variants={{
                        initial: {
                            y: 0,
                            scale: 1,
                        },
                        hover: {
                            y: -4,
                            scale: 1.2,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                delay: index * 0.03,
                            },
                        },
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
}

export { WaveText };
