import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Send, MessageSquare, Loader2, X, Lock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit,
    doc,
    getDoc,
    Timestamp 
} from 'firebase/firestore';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface ChatAssistantProps {
    isFullPage?: boolean;
}

/**
 * ChatPanel: Internal structure of the chat window.
 * Flex column with Header, Body (flex: 1), Footer.
 */
const ChatPanel: React.FC<{
    isFullPage: boolean;
    messages: Message[];
    input: string;
    isLoading: boolean;
    setInput: (val: string) => void;
    handleSend: () => void;
    setIsExpanded: (val: boolean) => void;
    scrollRef: React.RefObject<HTMLDivElement>;
}> = ({ isFullPage, messages, input, isLoading, setInput, handleSend, setIsExpanded, scrollRef }) => {
    return (
        <div className={cn(
            "bg-white flex flex-col border border-[#E5F4F9] shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-[1000] overflow-hidden transition-all duration-300",
            isFullPage
                ? "w-full rounded-[32px] h-full md:h-full max-md:h-[55vh] max-md:max-h-[55vh] max-md:rounded-t-[20px] max-md:rounded-b-none"
                : "fixed rounded-[20px]",
            // Responsiveness for non-full-page (Floating)
            !isFullPage && [
                "bottom-[80px] right-[4%] w-[92%] max-w-[420px] h-[65vh] max-height-[500px]", // Mobile
                "md:bottom-[90px] md:right-[24px] md:w-[320px] md:h-[420px]", // Tablet
                "lg:w-[320px] lg:h-[440px] lg:bottom-[90px] lg:right-[24px]" // Laptop/Desktop
            ]
        )}>
            {/* Header - Fixed Height Rule 3 */}
            <div className="h-[46px] min-h-[46px] flex items-center justify-between px-5 bg-white border-b border-[#F2FAFD] shrink-0">
                <div className="flex items-center gap-3">
                    <PawPrint size={18} className="text-[#49B3E8] fill-[#49B3E8]" />
                    <div className="flex flex-col">
                        <h1 className="font-bold text-[#0E2F44] text-[15px] leading-tight">PetVault Assistant</h1>
                        <span className="text-[10px] text-[#6F8A96] leading-none">Caring pet companion</span>
                    </div>
                </div>
                {!isFullPage && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-[#6F8A96] hover:text-[#0E2F44] transition-colors p-1 w-8 h-8 flex items-center justify-center"
                        aria-label="Close Chat"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Message Area - flex: 1 Rule 2 */}
            <ScrollArea className="flex-1 bg-white overflow-y-auto px-4" ref={scrollRef}>
                <div className="py-4 space-y-4"> {/* Rule 3: consistent vertical spacing */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#F2FAFD] flex items-center justify-center mb-3">
                                <MessageSquare size={22} className="text-[#49B3E8]" />
                            </div>
                            <p className="text-xs text-[#6F8A96] max-w-[200px] leading-relaxed font-semibold">
                                Hi! I'm your PetVault assistant. I can help with pet care tips and app features.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[85%] px-4 py-3 rounded-[20px] text-[13px] leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-[#0E2F44] text-white rounded-tr-none"
                                        : "bg-[#F2FAFD] text-[#0E2F44] rounded-tl-none border border-[#E5F4F9]"
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#F2FAFD] px-4 py-3 rounded-[20px] rounded-tl-none border border-[#E5F4F9] flex gap-1.5 items-center">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 h-1 bg-[#49B3E8] rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1 h-1 bg-[#49B3E8] rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1 h-1 bg-[#49B3E8] rounded-full" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area - Fixed Rule 2 & 3 */}
            <div className="sticky bottom-0 bg-white border-t border-[#F2FAFD] p-4 shrink-0" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
                <div className="flex items-center gap-3 h-11">
                    <div className="flex-1 h-full bg-[#F2FAFD] rounded-full px-4 border border-[#E5F4F9] transition-all focus-within:border-[#49B3E8] flex items-center">
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            className="w-full bg-transparent border-none outline-none text-[13px] text-[#0E2F44] placeholder:text-[#6F8A96]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={cn(
                            "w-[44px] h-[44px] rounded-full shrink-0 flex items-center justify-center transition-all",
                            input.trim()
                                ? "bg-[#49B3E8] text-white shadow-md active:scale-95"
                                : "bg-[#F2FAFD] text-slate-300 pointer-events-none"
                        )}
                        aria-label="Send"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isFullPage = true }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, profile } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        if (user) loadHistory(user.uid);
    }, [user]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                requestAnimationFrame(() => {
                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: 'smooth'
                    });
                });
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async (userId: string) => {
        try {
            const messagesQ = query(
                collection(db, 'chat_messages'),
                where('user_id', '==', userId),
                orderBy('created_at', 'asc'),
                limit(20)
            );
            const querySnapshot = await getDocs(messagesQ);
            const history = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: (doc.data().created_at as Timestamp).toDate().toISOString()
            })) as Message[];

            setMessages(history);
        } catch (err) {
            console.error('Error loading history:', err);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newUserMsg]);

        try {
            // Save user message to Firestore
            await addDoc(collection(db, 'chat_messages'), {
                user_id: user?.uid,
                role: 'user',
                content: userMessage,
                created_at: Timestamp.now()
            });

            // Call Groq API (client-side implementation)
            const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
            if (!groqApiKey) {
                throw new Error("GROQ API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.");
            }

            const petId = localStorage.getItem('last_selected_pet_id');
            let petContext = "";
            if (petId) {
                const petDoc = await getDoc(doc(db, 'pets', petId));
                if (petDoc.exists()) {
                    const pet = petDoc.data();
                    petContext = `The user is asking about their pet ${pet.name}, who is a ${pet.breed || pet.type}. `;
                }
            }

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
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message || "Failed to get AI response");
            
            const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

            // Save AI response to Firestore
            await addDoc(collection(db, 'chat_messages'), {
                user_id: user?.uid,
                role: 'assistant',
                content: aiResponse,
                created_at: Timestamp.now()
            });

            const newAiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, newAiMsg]);
        } catch (err: any) {
            console.error('Chat error:', err);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: err.message || "I'm having trouble connecting to my brain. Please try again later.",
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatPanel
            isFullPage={true}
            messages={messages}
            input={input}
            isLoading={isLoading}
            setInput={setInput}
            handleSend={handleSend}
            setIsExpanded={() => { }}
            scrollRef={scrollRef}
        />
    );
};
