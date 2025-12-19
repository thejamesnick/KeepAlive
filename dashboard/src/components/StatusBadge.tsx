
export function StatusBadge({ status }: { status: string }) {
    if (status === 'active') {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Active</span>
            </div>
        )
    }
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 dark:bg-rose-500/10 border border-neutral-100 dark:border-rose-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
            <span className="text-[10px] font-medium text-rose-700 dark:text-rose-400 uppercase tracking-wide">Dead</span>
        </div>
    )
}
