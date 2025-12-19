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

// Initial Mock Data
// We include secrets here to simulate they are stored in the DB
const INITIAL_PROJECTS = [
    {
        id: 1,
        name: "KeepAlive Self-Check",
        status: "active",
        lastPing: "2 mins ago",
        nextPing: "Tuesday 00:00",
        projectId: "kp_self_check_01",
        apiToken: "keep_live_demo_token_123"
    },
    {
        id: 2,
        name: "Portfolio Site V1",
        status: "active",
        lastPing: "1 hour ago",
        nextPing: "Tuesday 00:00",
        projectId: "kp_portfolio_02",
        apiToken: "keep_live_demo_token_456"
    },
    {
        id: 3,
        name: "Crypto Bot Demo",
        status: "dead",
        lastPing: "8 days ago",
        nextPing: "-",
        projectId: "kp_crypto_03",
        apiToken: "keep_live_demo_token_789"
    },
];

export default function Dashboard() {
    // Initial fetch simulation logic
    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [newProjectName, setNewProjectName] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [hasCopiedAll, setHasCopiedAll] = useState(false);

    // Simulate Data Fetching Delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // State to hold secrets for the *currently viewed* project
    const [activeSecrets, setActiveSecrets] = useState({
        PROJECT_ID: "",
        TOKEN: "",
        ENDPOINT: "https://keepalive.app/api/ping"
    });

    const openNewProject = () => {
        setNewProjectName("");
        setModalStep(1);
        setCurrentProject(null);
        // Reset secrets for new project (will be generated on submit)
        setActiveSecrets({
            PROJECT_ID: "Generating...",
            TOKEN: "Generating...",
            ENDPOINT: "https://keepalive.app/api/ping"
        });
        setIsModalOpen(true);
    };

    const openExistingProject = (project: any) => {
        setNewProjectName(project.name);
        setCurrentProject(project);
        // Load the PERSISTED secrets for this project
        setActiveSecrets({
            PROJECT_ID: project.projectId,
            TOKEN: project.apiToken,
            ENDPOINT: "https://keepalive.app/api/ping"
        });
        setModalStep(2); // Jump straight to integration view
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewProjectName("");
        setModalStep(1);
        setHasCopiedAll(false);
        setCurrentProject(null);
    };

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        // Generate secrets ONCE per project creation
        const newProjectId = generateProjectId();
        const newApiToken = generateApiToken();

        // Create the new project in state
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        const newProj = {
            id: newId,
            name: newProjectName,
            status: "active",
            lastPing: "Waiting...",
            nextPing: "Tuesday 00:00",
            projectId: newProjectId,   // STORE IT
            apiToken: newApiToken     // STORE IT
        };

        setProjects([...projects, newProj]);
        setCurrentProject(newProj);

        // Update the modal view to show these new secrets
        setActiveSecrets({
            PROJECT_ID: newProjectId,
            TOKEN: newApiToken,
            ENDPOINT: "https://keepalive.app/api/ping"
        });

        setModalStep(2);
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
                            {/* Render Skeletons during loading state */}
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                            <ProjectSkeleton />
                        </>
                    ) : (
                        <>
                            {/* Render Actual Projects */}
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
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
