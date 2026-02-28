import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { message, petId } = await req.json();
        const groqApiKey = Deno.env.get("GROQ_API_KEY");

        if (!groqApiKey) {
            throw new Error("Missing GROQ_API_KEY secret");
        }

        // Initialize Supabase Client (if needed for context, e.g., pet details)
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Fetch pet details for context if petId is provided
        let petContext = "";
        if (petId) {
            const { data: pet } = await supabase
                .from("pets")
                .select("*")
                .eq("id", petId)
                .single();

            if (pet) {
                petContext = `The user is asking about their pet ${pet.name}, who is a ${pet.breed || pet.type}. `;
            }
        }

        // Call Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful pet care assistant for PetVault. ${petContext} Provide concise, caring, and professional advice. If the user mentions medical emergencies like bleeding, seizure, or poison, advise them to contact a veterinarian immediately.`
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

        return new Response(JSON.stringify({ response: aiResponse }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
