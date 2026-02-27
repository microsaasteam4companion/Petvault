import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const supabaseClient = createClient(supabaseUrl ?? '', serviceRoleKey ?? '')

        const bodyText = await req.text()
        console.log('Raw Payload:', bodyText)
        const payload = JSON.parse(bodyText)

        // Dodo uses 'type' or 'event_type' depending on some configurations
        const eventType = payload.type || payload.event_type
        console.log('Event Type Detected:', eventType)

        if (eventType === 'payment.succeeded' || eventType === 'order.succeeded' || payload.data?.status === 'succeeded') {
            const data = payload.data
            const userId = data.metadata?.user_id || data.client_reference_id

            if (userId) {
                console.log(`Action: Upgrading User ${userId} to Pro...`)
                const { error } = await supabaseClient
                    .from('profiles')
                    .update({
                        plan_type: 'pro',
                        subscription_status: 'active',
                        subscription_start_date: new Date().toISOString(),
                    })
                    .eq('id', userId)

                if (error) {
                    console.error('Update Error:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
                }

                console.log('Successfully Upgraded!')
                return new Response(JSON.stringify({ message: 'Success' }), { status: 200, headers: corsHeaders })
            }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200, headers: corsHeaders })
    } catch (err: any) {
        console.error('Error:', err.message)
        return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders })
    }
})
