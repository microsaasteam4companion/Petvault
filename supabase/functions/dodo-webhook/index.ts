import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Log the entire raw request for debugging if needed
        const payload = await req.json()
        console.log('--- NEW WEBHOOK EVENT ---')
        console.log('Event Type:', payload.event_type)
        console.log('Full Payload:', JSON.stringify(payload, null, 2))

        const eventType = payload.event_type

        // Dodo Payments typically uses 'payment.succeeded' or 'subscription.created'
        if (eventType === 'payment.succeeded' || eventType === 'order.succeeded') {
            const data = payload.data

            // Look for userId in metadata (which comes from query params like metadata_user_id)
            const userId = data.metadata?.user_id || data.client_reference_id

            if (userId) {
                console.log(`Expert Update: Upgrading user ${userId} to Pro plan...`)

                const { error } = await supabaseClient
                    .from('profiles')
                    .update({
                        plan_type: 'pro',
                        subscription_status: 'active',
                        subscription_start_date: new Date().toISOString(),
                    })
                    .eq('id', userId)

                if (error) {
                    console.error('DATABASE ERROR:', error)
                    return new Response(JSON.stringify({ error: 'Database update failed', details: error }), {
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    })
                }

                console.log(`SUCCESS: User ${userId} is now Pro.`)
                return new Response(JSON.stringify({ message: 'User upgraded successfully' }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            } else {
                console.warn('CRITICAL: Webhook received but NO User ID found in metadata.')
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error('WEBHOOK PROCESSING ERROR:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
