import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-[24px] bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}
