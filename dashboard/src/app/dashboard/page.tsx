"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/Button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectSkeleton } from "@/components/ProjectSkeleton";
import { NewProjectModal } from "@/components/NewProjectModal";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { SettingsModal } from "@/components/SettingsModal";
import { generateProjectId, generateApiToken } from "@/lib/generators";
import { createClient } from "@/utils/supabase/client";

// Simple relative time formatter
function formatRelativeTime(dateString: string | null) {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export default function Dashboard() {
    const supabase = createClient();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [newProjectName, setNewProjectName] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [hasCopiedAll, setHasCopiedAll] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        async function loadData() {
            try {
                // 1. Get User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    window.location.href = '/login'; // Protect route
                    return;
                }
                setUser(user);

                // 2. Get Projects
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) {
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    // State to hold secrets for the *currently viewed* project
    const [activeSecrets, setActiveSecrets] = useState({
        PROJECT_ID: "",
        TOKEN: "",
        ENDPOINT: ""
    });

    const openNewProject = () => {
        setNewProjectName("");
        setModalStep(1);
        setCurrentProject(null);
        setActiveSecrets({
            PROJECT_ID: "Generating...",
            TOKEN: "Generating...",
            ENDPOINT: `${window.location.origin}/api/ping`
        });
        setIsModalOpen(true);
    };

    const openExistingProject = (project: any) => {
        setNewProjectName(project.name);
        setCurrentProject(project);

        // Pass the stored DB values
        setActiveSecrets({
            PROJECT_ID: project.project_id,
            TOKEN: project.api_token,
            ENDPOINT: `${window.location.origin}/api/ping`
        });
        setModalStep(2);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewProjectName("");
        setModalStep(1);
        setHasCopiedAll(false);
        setCurrentProject(null);
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim() || !user) return;

        // Generate secrets
        const newProjectId = generateProjectId();
        const newApiToken = generateApiToken();

        // Optimistic UI Update (Instant feel)
        const tempProject = {
            id: "temp-" + Date.now(),
            name: newProjectName,
            status: "pending",
            last_ping_at: null,
            project_id: newProjectId,
            api_token: newApiToken,
            created_at: new Date().toISOString()
        };
        setProjects([tempProject, ...projects]);

        // Show secrets immediately
        setActiveSecrets({
            PROJECT_ID: newProjectId,
            TOKEN: newApiToken,
            ENDPOINT: `${window.location.origin}/api/ping`
        });
        setModalStep(2);

        // Actual DB Insert
        const { data, error } = await supabase.from('projects').insert({
            user_id: user.id,
            name: newProjectName,
            project_id: newProjectId,
            api_token: newApiToken,
            status: 'pending'
        }).select().single();

        if (data) {
            // Replace temp project with real one
            setProjects(prev => prev.map(p => p.id === tempProject.id ? data : p));
            setCurrentProject(data);
        } else {
            console.error("Creation failed:", error);
            // Revert on error (optional)
        }
    };

    const handleCopyAll = () => {
        const text = `KEEPALIVE_PROJECT_ID=${activeSecrets.PROJECT_ID}\nKEEPALIVE_TOKEN=${activeSecrets.TOKEN}\nKEEPALIVE_ENDPOINT=${activeSecrets.ENDPOINT}`;
        navigator.clipboard.writeText(text);
        setHasCopiedAll(true);
        setTimeout(() => setHasCopiedAll(false), 2000);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black font-[family-name:var(--font-inter)] text-black dark:text-white">

            {/* Top Navigation */}
            <nav className="border-b border-black/5 dark:border-white/10 bg-white dark:bg-black sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="w-5 h-5" />
                        <span className="font-bold tracking-tight text-sm">Dashboard</span>
                    </div>

                    <ProfileDropdown
                        isOpen={isProfileOpen}
                        setIsOpen={setIsProfileOpen}
                        onSettingsClick={() => setIsSettingsOpen(true)}
                    />
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Your Projects</h1>
                        <p className="text-neutral-500 text-sm mt-1">Monitoring {projects.length} endpoints.</p>
                    </div>
                    <Button onClick={openNewProject}>
                        <Plus className="w-4 h-4" /> New Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <>
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                        </>
                    ) : (
                        <>
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={{
                                        ...project,
                                        // Adapter for ProjectCard which expects 'lastPing' (camelCase)
                                        lastPing: formatRelativeTime(project.last_ping_at),
                                        nextPing: project.status === 'active' ? 'Unknown' : '-' // Calculation can be added later
                                    }}
                                    onClick={() => openExistingProject(project)}
                                />
                            ))}

                            <button
                                onClick={openNewProject}
                                className="group h-40 rounded-[20px] border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all"
                            >
                                <Plus className="w-8 h-8 font-light" />
                                <span className="text-sm font-medium">Add Project</span>
                            </button>
                        </>
                    )}
                </div>
            </main>

            {/* MODAL */}
            <NewProjectModal
                isOpen={isModalOpen}
                onClose={closeModal}
                step={modalStep}
                setStep={setModalStep}
                projectName={newProjectName}
                setProjectName={setNewProjectName}
                onSubmit={handleCreateProject}
                currentProject={currentProject}
                secrets={activeSecrets}
                onCopyAll={handleCopyAll}
                hasCopiedAll={hasCopiedAll}
            />

            {/* SETTINGS MODAL */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

        </div>
    );
}
