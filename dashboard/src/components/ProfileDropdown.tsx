import { User, ChevronDown } from "lucide-react";

interface ProfileDropdownProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    userEmail?: string;
    onSettingsClick?: () => void;
}

export function ProfileDropdown({ isOpen, setIsOpen, userEmail = "user@example.com", onSettingsClick }: ProfileDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none group"
            >
                <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 transition-colors group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                    <User className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 px-1">
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">My Account</span>
                    <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#111] rounded-xl border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 mx-1 mb-1">
                            <p className="text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100">{userEmail}</p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mt-0.5">Free Plan</p>
                        </div>
                        <button
                            onClick={() => { setIsOpen(false); onSettingsClick?.(); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Account Settings
                        </button>
                        <button
                            disabled
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-400 dark:text-neutral-600 cursor-not-allowed flex justify-between items-center"
                        >
                            <span>Billing & Plans</span>
                            <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">SOON</span>
                        </button>
                        <div className="h-px bg-black/5 dark:bg-white/5 mx-2 my-1" />
                        <button
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            onClick={() => window.location.href = '/'}
                        >
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
