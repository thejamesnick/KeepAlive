"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function SecretRow({ label, value }: { label: string, value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-medium text-neutral-500 uppercase">{label}</span>
            <div className="group flex items-center gap-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 h-9 transition-colors hover:border-black/20 dark:hover:border-white/20">
                <code className="text-xs font-mono truncate flex-1">{value}</code>
                <button
                    onClick={handleCopy}
                    className="p-1 rounded-md text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    title="Copy"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>
    )
}
