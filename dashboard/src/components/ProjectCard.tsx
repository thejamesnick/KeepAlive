import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Activity, Globe } from "lucide-react";

export function ProjectCard({ project, onClick }: { project: any, onClick: () => void }) {
    return (
        <Card onClick={onClick} className="group relative p-5 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.99]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-sm tracking-tight">{project.name}</h3>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">ID: {project.id}</span>
                </div>
                <StatusBadge status={project.status} />
            </div>

            <div className="space-y-2 mt-6">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Last Ping</span>
                    <span className="font-mono">{project.lastPing}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Next Check</span>
                    <span className="font-mono text-neutral-400">{project.nextPing}</span>
                </div>
            </div>
        </Card>
    )
}
