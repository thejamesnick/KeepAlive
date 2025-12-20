
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // 1. Get Token from Header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing or malformed Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract 'keep_live_xyz...'

    // 2. Parse Status from Body
    let isSuccess = true;
    try {
        const body = await request.json();
        // If status is provided, check if it's 'ok'
        if (body && body.status) {
            isSuccess = body.status === 'ok';
        }
    } catch (e) {
        // Body reading failed or empty, default to true or handle gracefully
        // For now, we assume if we got a ping, it's a heartbeat unless stated otherwise
    }

    // 3. Call RPC Function (Securely bypasses RLS)
    const { data, error } = await supabase.rpc('register_ping', {
        token,
        success: isSuccess
    });

    if (error) {
        console.error('Ping Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    if (!data || !data.success) {
        return NextResponse.json({ error: 'Invalid API Token' }, { status: 403 });
    }

    // 3. Success
    return NextResponse.json({ success: true, message: 'Ping recorded' }, { status: 200 });
}
