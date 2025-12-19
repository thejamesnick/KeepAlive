"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { X, User, Mail, Shield } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

export function SettingsModal({ isOpen, onClose, userEmail = "user@example.com" }: SettingsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <Card className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight mx-1">Account Settings</h2>
                        <p className="text-sm text-neutral-500 mx-1">Manage your personal information.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-[#111] border border-black/5 dark:border-white/10">
                            <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Profile Picture</h3>
                                <p className="text-xs text-neutral-500">Upload a new avatar</p>
                            </div>
                            <Button variant="outline" className="ml-auto text-xs h-8" disabled>Change</Button>
                        </div>

                        {/* Email Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-500 uppercase ml-1">Email Address</label>
                            <div className="flex items-center gap-2 px-3 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111] text-sm text-neutral-600 dark:text-neutral-400">
                                <Mail className="w-4 h-4 opacity-50" />
                                {userEmail}
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-neutral-500 uppercase ml-1">Security</label>
                            <button className="w-full flex items-center justify-between px-3 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-[#111] transition-colors text-sm">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-neutral-500" />
                                    <span>Change Password</span>
                                </div>
                                <span className="text-xs text-neutral-400">Not available</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button onClick={onClose}>Save Changes</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
