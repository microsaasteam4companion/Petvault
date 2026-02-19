import { DashboardLayout } from '@/components/DashboardLayout';
import { ChatAssistant } from '@/components/ChatAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Pet } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AssistantPage() {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadPets();
        }
    }, [user]);

    // Scroll Lock Implementation
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const loadPets = async () => {
        try {
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPets(data || []);
            if (data && data.length > 0) {
                const lastPetId = localStorage.getItem('last_selected_pet_id');
                setSelectedPetId(lastPetId || data[0].id);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load pets.',
            });
        } finally {
            setLoading(false);
        }
    }

    const isBasic = profile?.plan_type === 'basic';

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#F2FAFD]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49B3E8]"></div>
        </div>
    );

    const handleUpgradeRedirect = () => {
        navigate('/');
        setTimeout(() => {
            const pricingElement = document.getElementById('pricing');
            if (pricingElement) {
                pricingElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div className="h-screen flex flex-col bg-[#F2FAFD] overflow-hidden">
            <DashboardLayout
                pets={pets}
                selectedPetId={selectedPetId}
                onPetSelect={setSelectedPetId}
                onAddPet={() => { }}
                selectedCategory="all"
                onCategorySelect={() => { }}
                searchQuery=""
                onSearchChange={() => { }}
                onDeletePet={() => { }}
            >
                <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
                    <div className="flex-1 w-full max-w-[800px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-[#E5F4F9] flex flex-col relative">
                        {isBasic ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                                <div className="w-20 h-20 bg-[#F2FAFD] rounded-full flex items-center justify-center mb-6">
                                    <Lock className="w-10 h-10 text-[#49B3E8]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#0E2F44] mb-3">
                                    Personal Assistant is available on Pro
                                </h2>
                                <p className="text-[#6F8A96] mb-8 max-w-[320px] leading-relaxed line-clamp-3">
                                    Upgrade to unlock personalized health insights and interactive pet care guidance.
                                </p>
                                <Button
                                    onClick={handleUpgradeRedirect}
                                    className="h-12 px-8 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    Upgrade to Pro
                                </Button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <ChatAssistant isFullPage={true} />
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}


