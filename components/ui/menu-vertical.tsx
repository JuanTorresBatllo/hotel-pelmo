import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type MenuItem = {
  label: string;
  viewKey: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  activeView?: string;
  onNavigate: (viewKey: string) => void;
  color?: string;
  skew?: number;
}

export const MenuVertical: React.FC<MenuVerticalProps> = ({
  menuItems = [],
  activeView,
  onNavigate,
  color = "#99ccff",
  skew = -3,
}) => {
  return (
    <div className="flex w-fit flex-col gap-4 px-6">
      {menuItems.map((item, index) => {
        const isActive = activeView === item.viewKey;
        return (
          <motion.div
            key={`${item.viewKey}-${index}`}
            className="group/nav flex items-center gap-2 cursor-pointer"
            initial="initial"
            whileHover="hover"
            animate={isActive ? "hover" : "initial"}
            onClick={() => onNavigate(item.viewKey)}
          >
            <motion.div
              variants={{
                initial: { x: "-100%", opacity: 0 },
                hover: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="z-0"
              style={{ color }}
            >
              <ArrowRight strokeWidth={3} className="size-6 md:size-8" />
            </motion.div>

            <motion.span
              variants={{
                initial: { x: -32, color: "rgba(255,255,255,0.5)" },
                hover: { x: 0, color, skewX: skew },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-semibold text-lg md:text-2xl uppercase tracking-[0.15em] whitespace-nowrap"
              style={{ fontFamily: "'PT Sans', sans-serif" }}
            >
              {item.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
};
