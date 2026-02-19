import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !process.env.GROQ_API_KEY) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MEDICAL_GUARDRAIL_KEYWORDS = [
    'emergency', 'bleeding', 'vomiting', 'seizure', 'unconscious', 'poison',
    'toxic', 'difficulty breathing', 'broken bone', 'choking', 'dosage',
    'medication', 'medicine', 'illness', 'sick', 'severe'
];

app.post('/api/chat', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        let user = null;
        let userSupabase = supabase;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token && token !== 'null' && token !== 'undefined') {
                const tempClient = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY, {
                    global: { headers: { Authorization: `Bearer ${token}` } }
                });
                const { data: authData } = await tempClient.auth.getUser();
                if (authData?.user) {
                    user = authData.user;
                    userSupabase = tempClient;
                }
            }
        }

        const { message, petId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Rate Limiting (Logged-in users only)
        if (user) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const { count } = await userSupabase
                .from('chat_messages')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('created_at', oneHourAgo);

            if (count !== null && count >= 20) {
                return res.status(429).json({ error: 'Rate limit exceeded. Max 20 messages per hour.' });
            }
        }

        // Medical Guardrail check
        const lowerMessage = message.toLowerCase();
        const isMedical = MEDICAL_GUARDRAIL_KEYWORDS.some(kw => lowerMessage.includes(kw));

        if (isMedical && (lowerMessage.includes('emergency') || lowerMessage.includes('severe') || lowerMessage.includes('dosage'))) {
            const response = "This could be serious. Please contact your veterinarian immediately. I’m not a substitute for professional veterinary advice.";

            if (user) {
                await userSupabase.from('chat_messages').insert([
                    { user_id: user.id, role: 'user', content: message },
                    { user_id: user.id, role: 'assistant', content: response }
                ]);
            }

            return res.json({ response });
        }

        // Retrieve user profile for plan context
        let planContext = "";
        let isPro = false;
        if (user) {
            const { data: profile } = await userSupabase
                .from('profiles')
                .select('plan_type')
                .eq('id', user.id)
                .single();

            if (profile) {
                isPro = profile.plan_type === 'pro';
                planContext = `\nUser Plan: ${profile.plan_type.toUpperCase()}
Basic Plan: 1 pet, 15 document uploads, in-app reminders.
Pro Plan: Unlimited pets, unlimited document uploads, email/recurring reminders, PDF exports, list/grid vault.`;
            }
        }

        // Retrieve pet data (only if logged in)
        let petContext = "";
        if (user) {
            // If Pro, fetch summary of all pets
            if (isPro) {
                const { data: allPets } = await userSupabase
                    .from('pets')
                    .select('name, breed, age');
                if (allPets && allPets.length > 0) {
                    petContext += `\nUser's Pets: ${allPets.map(p => `${p.name} (${p.breed}, ${p.age}y)`).join(', ')}`;
                }
            }

            if (petId) {
                const { data: pet } = await userSupabase
                    .from('pets')
                    .select('*')
                    .eq('id', petId)
                    .single();

                if (pet) {
                    // Fetch weight logs
                    const { data: weights } = await userSupabase
                        .from('timeline_entries')
                        .select('date, metadata')
                        .eq('pet_id', pet.id)
                        .eq('category', 'weight')
                        .order('date', { ascending: false })
                        .limit(5);

                    const weightLogs = weights?.map(w => `${w.date}: ${w.metadata?.weight_value}kg`).join(', ') || 'No weight logs found';

                    // Fetch recent symptoms
                    const { data: symptoms } = await userSupabase
                        .from('timeline_entries')
                        .select('date, title, description')
                        .eq('pet_id', pet.id)
                        .eq('category', 'illness')
                        .order('date', { ascending: false })
                        .limit(3);

                    const symptomLogs = symptoms?.map(s => `${s.date}: ${s.title} (${s.description})`).join(', ') || 'No recent symptoms recorded';

                    // Fetch upcoming reminders
                    const { data: reminders } = await userSupabase
                        .from('reminders')
                        .select('title, date, status')
                        .eq('pet_id', pet.id)
                        .eq('status', 'pending')
                        .order('date', { ascending: true })
                        .limit(5);

                    const reminderLogs = reminders?.map(r => `${r.date}: ${r.title}`).join(', ') || 'No upcoming reminders';

                    // Fetch recent documents (files)
                    const { data: files } = await userSupabase
                        .from('files')
                        .select('name, file_type, created_at')
                        .eq('pet_id', pet.id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    const fileLogs = files?.map(f => `${f.name} (${f.file_type})`).join(', ') || 'No documents uploaded';

                    petContext += `\n\nActive Pet Context (${pet.name}):
Breed: ${pet.breed || 'Unknown'}
Age: ${pet.age || 'Unknown'} years
Current Weight: ${pet.weight || 'Unknown'} kg
Recent Weight Logs: ${weightLogs}
Recent Symptoms: ${symptomLogs}
Upcoming Reminders: ${reminderLogs}
Recent Documents: ${fileLogs}`;
                }
            }
        }

        // Retrieve last 10 messages (only if logged in)
        let history = [];
        if (user) {
            const { data } = await userSupabase
                .from('chat_messages')
                .select('role, content')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            history = data || [];
        }



        const SYSTEM_PROMPT = `You are PetVault Assistant, a warm and caring pet companion.
You answer questions about pet health, food, grooming, behavior, and daily care in simple language.
You also explain PetVault features including reminders, document vault, pricing plans, PDF exports, and profile management.
If user is on Basic plan, do not mention Pro features unless asked.
Never provide medical diagnosis.
Encourage consulting a veterinarian for serious symptoms.
Keep answers kind, simple, and reassuring.${planContext}${petContext}`;

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...(history.reverse().map(m => ({ role: m.role, content: m.content }))),
            { role: 'user', content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.4,
            max_tokens: 800,
            top_p: 0.9,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "Assistant is temporarily unavailable. Please try again shortly.";

        // Store messages (only if logged in)
        if (user) {
            await userSupabase.from('chat_messages').insert([
                { user_id: user.id, role: 'user', content: message },
                { user_id: user.id, role: 'assistant', content: aiResponse }
            ]);
        }

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Assistant is temporarily unavailable. Please try again shortly.' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
