"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SecretRow } from "@/components/SecretRow";
import { X, Check, Copy, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    step: number;
    setStep: (step: number) => void;
    projectName: string;
    setProjectName: (name: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    currentProject: any;
    secrets: {
        PROJECT_ID: string;
        TOKEN: string;
        ENDPOINT: string;
    };
    onCopyAll: () => void;
    hasCopiedAll: boolean;
}

// Function to generate the YAML content dynamically
const getWorkflowYaml = (minute: number, hour: number) => `name: KeepAlive Service

on:
  schedule:
    - cron: '${minute} ${hour} * * 2,4' # Runs at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} UTC on Tue/Thu
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      - name: Check Database Health
        id: check_db
        run: |
          STATUS="failed"
          
          # 1. SUPABASE HEALTH CHECK
          # Requires: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in GitHub Secrets
          SUPABASE_URL="\${{ secrets.SUPABASE_URL }}"
          SUPABASE_KEY="\${{ secrets.SUPABASE_PUBLISHABLE_KEY }}"
          
          # Fallback to generic SUPABASE_KEY if PUBLISHABLE is missing
          if [ -z "$SUPABASE_KEY" ]; then
             SUPABASE_KEY="\${{ secrets.SUPABASE_KEY }}"
          fi

          if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_KEY" ]; then
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \\
              --request GET \\
              --url "$SUPABASE_URL/auth/v1/health" \\
              --header "apikey: $SUPABASE_KEY" \\
            )
            if [ "$HTTP_CODE" -eq 200 ]; then STATUS="ok"; fi
          fi

          # 2. POSTGRES CONNECTION CHECK (DIRECT)
          if [ -n "\${{ secrets.DATABASE_URL }}" ]; then
             if psql "\${{ secrets.DATABASE_URL }}" -c "SELECT 1" > /dev/null 2>&1; then
               STATUS="ok"
             fi
          fi
          
          echo "status=$STATUS" >> $GITHUB_OUTPUT

      - name: Report to KeepAlive Dashboard
        if: always()
        run: |
          STATUS="\${{ steps.check_db.outputs.status }}"
          if [ -z "$STATUS" ]; then STATUS="failed"; fi
          
          curl -s \\
            --request POST \\
            --url "\${{ secrets.KEEPALIVE_ENDPOINT }}/api/ping" \\
            --header "Content-Type: application/json" \\
            --header "Authorization: Bearer \${{ secrets.KEEPALIVE_TOKEN }}" \\
            --data "{\\"project_id\\": \\"\${{ secrets.KEEPALIVE_PROJECT_ID }}\\", \\"status\\": \\"$STATUS\\"}"`;

function WorkflowBlock({ yaml }: { yaml: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(yaml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between mx-1">
                <span className="text-[10px] font-mono font-medium text-neutral-500 uppercase">.github/workflows/keepalive.yml</span>
            </div>
            <div className="relative group">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={handleCopy}
                        className="h-6 px-2 flex items-center gap-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-[10px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors shadow-sm"
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
                <pre className="h-64 overflow-y-auto w-full p-3 rounded-xl bg-neutral-900 text-neutral-300 text-[10px] font-mono leading-relaxed border border-black/5 dark:border-white/10 selection:bg-neutral-700 font-normal">
                    <code>{yaml}</code>
                </pre>
            </div>
        </div>
    )
}

export function NewProjectModal({
    isOpen,
    onClose,
    step,
    setStep,
    projectName,
    setProjectName,
    onSubmit,
    currentProject,
    secrets,
    onCopyAll,
    hasCopiedAll
}: NewProjectModalProps) {

    // Generate random minute (0-59) to stagger the checks across the full hour.
    // This distributes server load so not all users hit at 00:00, preventing overload.
    const [minute] = useState(() => Math.floor(Math.random() * 60));
    const hour = 0; // Fixed at midnight

    // Create the YAML string
    const dynamicYaml = getWorkflowYaml(minute, hour);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <Card className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] shadow-2xl animate-in zoom-in-95 duration-200 transform-gpu">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 1 && (
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight mx-1">Create Project</h2>
                            <p className="text-sm text-neutral-500 mx-1">What are you keeping alive today?</p>
                        </div>
                        <div className="space-y-2">
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g. My Portfolio"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black text-base focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Continue →</Button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold">1</span>
                                <h2 className="text-xl font-bold tracking-tight">Get Credentials</h2>
                            </div>
                            <p className="text-sm text-neutral-500 mx-5">
                                Add these <b>KeepAlive Keys</b> to your GitHub Secrets. <br />
                                <span className="text-xs opacity-70">(Ensure you also have <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">SUPABASE_URL</code> & <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">SUPABASE_PUBLISHABLE_KEY</code> set if monitoring Supabase)</span>
                            </p>
                        </div>

                        <div className="space-y-3 bg-neutral-50 dark:bg-[#111] p-4 rounded-xl border border-black/5 dark:border-white/10">
                            <SecretRow label="KEEPALIVE_PROJECT_ID" value={secrets.PROJECT_ID} />
                            <SecretRow label="KEEPALIVE_TOKEN" value={secrets.TOKEN} />
                            <SecretRow label="KEEPALIVE_ENDPOINT" value={secrets.ENDPOINT} />

                            <div className="pt-2 border-t border-black/5 dark:border-white/5 mt-2">
                                <button
                                    type="button"
                                    onClick={onCopyAll}
                                    className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {hasCopiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    {hasCopiedAll ? "Copied all secrets!" : "Copy all as .env block"}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button onClick={() => setStep(3)}>
                                Next Step <ArrowRight className="w-4 h-4 ml-1 opacity-60" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold">2</span>
                                <h2 className="text-xl font-bold tracking-tight">Add Workflow</h2>
                            </div>
                            <p className="text-sm text-neutral-500 mx-5">
                                Create this file to run the pings.
                            </p>
                        </div>

                        <WorkflowBlock yaml={dynamicYaml} />

                        <div className="pt-2 flex justify-between">
                            <button onClick={() => setStep(2)} className="text-sm text-neutral-500 hover:text-black dark:hover:text-white px-2">
                                ← Back
                            </button>
                            <Button className="w-32" onClick={onClose}>Done</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
