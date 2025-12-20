export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="max-w-md text-neutral-600 dark:text-neutral-400 mb-6">
                Something went wrong while verifying your login with the provider.
                This usually happens if the link expired or the configuration is mismatched.
            </p>
            <a
                href="/login"
                className="px-4 py-2 bg-black text-white rounded hover:opacity-80 transition"
            >
                Try Logging In Again
            </a>
        </div>
    )
}
