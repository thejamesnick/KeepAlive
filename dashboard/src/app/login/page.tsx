"use client";

import Logo from "@/components/Logo";

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black font-[family-name:var(--font-inter)] text-black dark:text-white">

            <div className="w-full max-w-sm p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <Logo className="w-10 h-10 mb-2" />
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-neutral-500">Enter your email to sign in to your dashboard</p>
                </div>

                {/* Login Form */}
                <form className="space-y-4" action="/dashboard"> {/* Mock Action for Demo */}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="h-10 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" /><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" /><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" /><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.424 44.599 -10.174 45.799 L -6.704 42.329 C -8.804 40.379 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" /></g></svg>
                            Google
                        </button>

                        <button
                            type="button"
                            className="h-10 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            GitHub
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-black px-2 text-neutral-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-10 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Sign In with Email
                    </button>

                </form>

                <p className="px-8 text-center text-xs text-neutral-500">
                    By clicking continue, you agree to our <a href="#" className="underline underline-offset-4 hover:text-black dark:hover:text-white">Terms of Service</a> and <a href="#" className="underline underline-offset-4 hover:text-black dark:hover:text-white">Privacy Policy</a>.
                </p>

            </div>

        </div>
    );
}
