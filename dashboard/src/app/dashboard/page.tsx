import Logo from "@/components/Logo";

// Mock Data for UI Dev
const MOCK_PROJECTS = [
    { id: 1, name: "KeepAlive Self-Check", status: "active", lastPing: "2 mins ago", nextPing: "Tuesday 00:00" },
    { id: 2, name: "Portfolio Site V1", status: "active", lastPing: "1 hour ago", nextPing: "Tuesday 00:00" },
    { id: 3, name: "Crypto Bot Demo", status: "dead", lastPing: "8 days ago", nextPing: "-" },
];

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black font-[family-name:var(--font-inter)] text-black dark:text-white">

            {/* Top Navigation */}
            <nav className="border-b border-black/5 dark:border-white/10 bg-white dark:bg-black sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="w-5 h-5" />
                        <span className="font-bold tracking-tight text-sm">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-mono">
                            ME
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12">

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Your Projects</h1>
                        <p className="text-neutral-500 text-sm mt-1">Monitoring {MOCK_PROJECTS.length} endpoints.</p>
                    </div>
                    <button className="h-10 px-4 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2">
                        <span>+</span> New Project
                    </button>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_PROJECTS.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}

                    {/* Empty State / Add Card */}
                    <button className="group h-40 rounded-[20px] border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all">
                        <span className="text-2xl font-light">+</span>
                        <span className="text-sm font-medium">Add Project</span>
                    </button>
                </div>

            </main>
        </div>
    );
}

function ProjectCard({ project }: { project: any }) {
    const isAlive = project.status === "active";

    return (
        <div className="group relative p-5 rounded-[20px] bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 hover:shadow-xl hover:border-black/10 dark:hover:border-white/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-sm tracking-tight">{project.name}</h3>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">ID: {project.id}</span>
                </div>
                <StatusBadge status={project.status} />
            </div>

            <div className="space-y-2 mt-6">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Last Ping</span>
                    <span className="font-mono">{project.lastPing}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Next Check</span>
                    <span className="font-mono text-neutral-400">{project.nextPing}</span>
                </div>
            </div>

            {/* Hover Action */}
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Context Menu Icon placeholder */}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
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
