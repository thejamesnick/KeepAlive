import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
    const baseStyles = "h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";

    const variants = {
        primary: "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
        secondary: "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700",
        outline: "border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
