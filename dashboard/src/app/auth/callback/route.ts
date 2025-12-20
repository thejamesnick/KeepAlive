
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            // STRATEGY: 
            // 1. Env Var (Best for Prod)
            // 2. X-Forwarded-Host (Good for Vercel/proxies)
            // 3. Origin (Fallback for Localhost)

            let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

            if (!baseUrl) {
                if (isLocalEnv) {
                    baseUrl = origin;
                } else if (forwardedHost) {
                    baseUrl = `https://${forwardedHost}`;
                } else {
                    baseUrl = origin;
                }
            }

            return NextResponse.redirect(`${baseUrl}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
