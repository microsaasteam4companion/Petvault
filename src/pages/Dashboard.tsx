// Dashboard Page - REBUILT TO FIX CACHE ISSUES
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Pet } from '@/lib/supabase';
import { CreatePetProfile } from '@/components/CreatePetProfile';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TimelineFeed } from '@/components/TimelineFeed';
import { useToast } from '@/hooks/use-toast';
import { UpgradeModal } from '@/components/UpgradeModal';

export default function Dashboard() {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showCreatePet, setShowCreatePet] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            loadPets();
        }
    }, [user]);

    const loadPets = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPets(data || []);

            if (!data || data.length === 0) {
                setShowCreatePet(true);
            } else {
                setSelectedPetId(data[0].id);
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
    };

    const handlePetCreated = () => {
        setShowCreatePet(false);
        loadPets();
    };

    const handleAddPet = () => {
        if (profile?.plan_type === 'basic' && pets.length >= 1) {
            setShowUpgradeModal(true);
        } else {
            setShowCreatePet(true);
        }
    };

    const handleDeletePet = async (petId: string) => {
        try {
            const { error } = await supabase
                .from('pets')
                .delete()
                .eq('id', petId);

            if (error) throw error;

            toast({ title: 'Pet Deleted', description: 'The pet profile has been removed.' });
            loadPets();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete pet.',
            });
        }
    };

    useEffect(() => {
        if (selectedPetId) {
            localStorage.setItem('last_selected_pet_id', selectedPetId);
        }
    }, [selectedPetId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                title="Manage Multiple Pets"
                description="The Basic plan allows for one pet profile."
            />

            <CreatePetProfile
                open={showCreatePet}
                onComplete={handlePetCreated}
                canCancel={pets.length > 0}
                onCancel={() => setShowCreatePet(false)}
            />

            <DashboardLayout
                pets={pets}
                selectedPetId={selectedPetId}
                onPetSelect={setSelectedPetId}
                onAddPet={handleAddPet}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onDeletePet={handleDeletePet}
            >
                <div className="flex flex-col gap-10">
                    {pets.length > 0 ? (
                        <TimelineFeed
                            petId={selectedPetId}
                            category={selectedCategory}
                            searchQuery={searchQuery}
                        />
                    ) : (
                        <div className="bg-white rounded-[24px] p-12 text-center shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to PetVault</h3>
                            <p className="text-slate-500 mb-6">Start by adding your pet's profile to track their journey.</p>
                        </div>
                    )}

                </div>
            </DashboardLayout>
        </>
    );
}
