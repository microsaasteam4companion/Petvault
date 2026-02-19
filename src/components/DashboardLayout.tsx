import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { type Pet } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AddEntryModal } from '@/components/AddEntryModal';
import {
    LogOut,
    Plus,
    Trash2,
    Search,
    Heart,
    Syringe,
    Stethoscope,
    Activity,
    Bone,
    FileText,
    Archive,
    PawPrint,
    Menu,
    X,
    Lock,
    Bell,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { UpgradeModal } from './UpgradeModal';
import { NotificationBanner } from './NotificationBanner';
import { generatePetReport } from '@/lib/pdfGenerator';
import { supabase } from '@/lib/supabase';
import { format, addDays, isSameDay } from 'date-fns';

interface DashboardLayoutProps {
    pets: Pet[];
    selectedPetId: string;
    onPetSelect: (petId: string) => void;
    onAddPet: () => void;
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onDeletePet: (petId: string) => void;
    children: React.ReactNode;
}

const categories = [
    { id: 'all', label: 'All Records', icon: FileText },
    { id: 'vaccine', label: 'Vaccines', icon: Syringe },
    { id: 'illness', label: 'Illness', icon: Heart },
    { id: 'food', label: 'Food', icon: Bone },
    { id: 'weight', label: 'Weight', icon: Activity },
    { id: 'behavior', label: 'Behavior', icon: Heart },
    { id: 'vet_visit', label: 'Vet Visits', icon: Stethoscope },
];

export function DashboardLayout({
    pets,
    selectedPetId,
    onPetSelect,
    onAddPet,
    selectedCategory,
    onCategorySelect,
    searchQuery,
    onSearchChange,
    onDeletePet,
    children,
}: DashboardLayoutProps) {
    const { user, signOut, profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [petToDelete, setPetToDelete] = useState<string | null>(null);
    const [activeReminder, setActiveReminder] = useState<any>(null);
    const [reminderBannerDismissed, setReminderBannerDismissed] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const selectedPet = pets.find((p) => p.id === selectedPetId);

    // Fetch upcoming reminders
    useEffect(() => {
        if (user && selectedPetId) {
            checkReminders();
        }
    }, [user, selectedPetId]);

    const checkReminders = async () => {
        try {
            const tomorrow = addDays(new Date(), 1);
            const { data, error, status } = await supabase
                .from('reminders')
                .select('*')
                .eq('pet_id', selectedPetId)
                .eq('status', 'pending');

            if (error) {
                if (status === 404 || error.code === 'PGRST116') {
                    console.warn('Reminders table not found. Please run the SQL schema to enable reminders.');
                    return;
                }
                throw error;
            }

            const upcoming = data?.find(r => isSameDay(new Date(r.date), tomorrow));
            if (upcoming) {
                setActiveReminder(upcoming);
            } else {
                setActiveReminder(null);
            }
        } catch (err: any) {
            if (err.status !== 404) {
                console.error('Error checking reminders:', err);
            }
        }
    };

    const handleExportPDF = async () => {
        if (profile?.plan_type === 'basic') {
            setShowUpgradeModal(true);
            return;
        }

        if (!selectedPet) return;

        setIsExporting(true);
        toast({ title: 'Preparing Report', description: `Gathering ${selectedPet.name}'s health history...` });

        try {
            const { data: entries, error: entriesError } = await supabase
                .from('timeline_entries')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false });

            if (entriesError) throw entriesError;

            const entryIds = entries.map(e => e.id);
            const { data: files, error: filesError } = await supabase
                .from('files')
                .select('*')
                .in('entry_id', entryIds);

            if (filesError) throw filesError;

            await generatePetReport(selectedPet as any, entries, files || []);

            toast({ title: 'Report Ready!', description: 'Your PDF has been generated successfully.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Export Failed', description: error.message });
        } finally {
            setIsExporting(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F2FAFD] font-poppins h-full flex flex-col">
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                title="Export Comprehensive Reports"
                description="Exporting your pet's entire health history as a polished PDF is a Pro feature. Perfect for sharing with new vets or insurance providers."
            />
            <AddEntryModal
                open={showAddEntry}
                onClose={() => setShowAddEntry(false)}
                petId={selectedPetId}
            />

            <AlertDialog open={!!petToDelete} onOpenChange={(open) => !open && setPetToDelete(null)}>
                <AlertDialogContent className="max-w-[400px] w-[92%] rounded-[32px] p-8 border-none shadow-[0_25px_80px_rgba(0,0,0,0.15)] flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 shrink-0">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <AlertDialogHeader className="text-center">
                        <AlertDialogTitle className="text-2xl font-extrabold text-[#0E2F44]">Delete Profile?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6F8A96] mt-3 leading-relaxed">
                            This will permanently remove <b>all medical history</b>, vaccine records, and documents for this pet. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-6">
                        <AlertDialogCancel className="rounded-full h-12 px-8 border-[#E5F4F9] text-[#6F8A96] font-bold hover:bg-[#F2FAFD] hover:text-[#0E2F44]">
                            Keep Profile
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (petToDelete) onDeletePet(petToDelete);
                                setPetToDelete(null);
                            }}
                            className="rounded-full h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-200"
                        >
                            Yes, Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AnimatePresence>
                {activeReminder && !reminderBannerDismissed && (
                    <NotificationBanner
                        title={`Upcoming Reminder: ${selectedPet?.name}`}
                        message={`Don't forget: ${activeReminder.title} is scheduled for tomorrow (${format(new Date(activeReminder.date), 'MMM dd')}).`}
                        onClose={() => setReminderBannerDismissed(true)}
                        onView={() => {
                            onCategorySelect('all');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-white border-b border-[#E5F4F9] sticky top-0 z-[40] shadow-sm shrink-0">
                <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F6C343] flex items-center justify-center shadow-sm">
                                <PawPrint className="w-5 h-5 text-[#0E2F44]" />
                            </div>
                            <h1 className="text-xl font-bold text-[#0E2F44] tracking-tight">
                                PetVault
                            </h1>
                        </Link>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="relative mr-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-[#6F8A96] hover:text-[#0E2F44] hover:bg-[#F2FAFD]"
                                >
                                    <Bell className="w-5 h-5" />
                                    {activeReminder && (
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="rounded-full text-[#6F8A96] hover:text-[#0E2F44] hover:bg-[#F2FAFD]"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                {profile?.plan_type === 'basic' && <Lock className="w-3 h-3 mr-1 text-[#49B3E8]" />}
                                {isExporting ? 'Generating...' : 'Export PDF'}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigate('/vault')}
                                className="rounded-full text-[#6F8A96] hover:text-[#0E2F44] hover:bg-[#F2FAFD]"
                            >
                                <Archive className="w-4 h-4 mr-2" />
                                Vault
                            </Button>
                            <Button
                                onClick={handleSignOut}
                                className="rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>

                        {/* Mobile Menu Button - Using Sheet */}
                        <div className="lg:hidden">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Menu className="w-6 h-6 text-[#0E2F44]" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 border-none rounded-r-[32px] overflow-hidden">
                                    <SheetHeader className="sr-only">
                                        <SheetTitle>Mobile Navigation Menu</SheetTitle>
                                        <SheetDescription>Access your pet profiles and dashboard categories</SheetDescription>
                                    </SheetHeader>
                                    <ScrollArea className="h-full">
                                        <div className="p-6">
                                            {/* My Pets Section in Mobile Menu */}
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="font-bold text-lg text-[#0E2F44]">My Pets</h2>
                                                <Button
                                                    size="sm"
                                                    onClick={onAddPet}
                                                    className="rounded-full bg-[#F6C343] hover:bg-[#F6C343]/90 text-[#0E2F44] w-10 h-10 p-0"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </Button>
                                            </div>

                                            <div className="space-y-3 mb-8">
                                                {pets.map((pet) => (
                                                    <div
                                                        key={pet.id}
                                                        onClick={() => {
                                                            onPetSelect(pet.id);
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className={`w-full group flex items-center gap-3 p-3 rounded-[16px] transition-all duration-300 cursor-pointer ${selectedPetId === pet.id
                                                            ? 'bg-[#49B3E8]/10 border border-[#49B3E8]/30 shadow-sm'
                                                            : 'hover:bg-[#F2FAFD]'
                                                            }`}
                                                    >
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={pet.photo_url || undefined} />
                                                            <AvatarFallback className="bg-gradient-to-br from-[#49B3E8] to-[#A7DCE8] text-white">
                                                                {pet.name[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="text-left flex-1 min-w-0">
                                                            <p className="font-semibold text-[#0E2F44] text-sm truncate">{pet.name}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-2 mb-8 text-[#0E2F44]">
                                                <h3 className="font-bold text-sm mb-4 px-2">Dashboard Sections</h3>
                                                {categories.map((category) => {
                                                    const Icon = category.icon;
                                                    return (
                                                        <button
                                                            key={category.id}
                                                            onClick={() => {
                                                                onCategorySelect(category.id);
                                                                setIsMenuOpen(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium ${selectedCategory === category.id
                                                                ? 'bg-[#49B3E8] text-white'
                                                                : 'text-[#6F8A96] hover:bg-[#F2FAFD]'
                                                                }`}
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                            <span>{category.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="pt-6 border-t border-[#E5F4F9] space-y-3">
                                                <Button
                                                    onClick={() => navigate('/vault')}
                                                    variant="outline"
                                                    className="w-full rounded-full border-[#E5F4F9] h-12"
                                                >
                                                    <Archive className="w-4 h-4 mr-2" />
                                                    Document Vault
                                                </Button>
                                                <Button
                                                    onClick={handleSignOut}
                                                    className="w-full rounded-full bg-[#0E2F44] text-white h-12"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Secure Sign Out
                                                </Button>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 py-8 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Sidebar - Shown on desktop */}
                    <aside className="lg:col-span-3 xl:col-span-3 hidden lg:block">
                        <div className="bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-6 sticky top-4">
                            {/* My Pets Section */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-lg text-[#0E2F44]">My Pets</h2>
                                <Button
                                    size="sm"
                                    onClick={onAddPet}
                                    className="rounded-full bg-[#F6C343] hover:bg-[#F6C343]/90 text-[#0E2F44] w-10 h-10 p-0"
                                >
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </div>

                            <ScrollArea className="h-[200px] mb-6">
                                <div className="space-y-3">
                                    {pets.map((pet) => (
                                        <div
                                            key={pet.id}
                                            onClick={() => {
                                                onPetSelect(pet.id);
                                            }}
                                            className={`w-full group flex items-center gap-3 p-3 rounded-[16px] transition-all duration-300 cursor-pointer ${selectedPetId === pet.id
                                                ? 'bg-gradient-to-r from-[#49B3E8]/10 to-[#A7DCE8]/10 border-2 border-[#49B3E8]/30'
                                                : 'hover:bg-[#F2FAFD]'
                                                }`}
                                        >
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                                <AvatarImage src={pet.photo_url || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-[#49B3E8] to-[#A7DCE8] text-white font-bold">
                                                    {pet.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left flex-1 min-w-0">
                                                <p className="font-semibold text-[#0E2F44] text-sm truncate">{pet.name}</p>
                                                <p className="text-xs text-[#6F8A96] truncate">{pet.breed || 'Mixed breed'}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPetToDelete(pet.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <Button
                                onClick={() => {
                                    setShowAddEntry(true);
                                }}
                                className="w-full h-12 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Entry
                            </Button>

                            {/* Categories */}
                            <div className="mt-8">
                                <h3 className="font-semibold text-sm mb-4 text-[#0E2F44]">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const Icon = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    onCategorySelect(category.id);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium ${selectedCategory === category.id
                                                    ? 'bg-[#49B3E8] text-white shadow-md'
                                                    : 'text-[#6F8A96] hover:bg-[#F2FAFD] hover:text-[#0E2F44]'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{category.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="grid-cols-1 lg:col-span-9 xl:col-span-6">
                        {/* Pet Profile Header */}
                        <div className="bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-6 lg:p-8 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#49B3E8]/10 to-[#A7DCE8]/10 rounded-full -mr-32 -mt-32"></div>

                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                                    <AvatarImage src={selectedPet?.photo_url || undefined} />
                                    <AvatarFallback className="bg-gradient-to-br from-[#49B3E8] to-[#A7DCE8] text-white text-3xl font-bold">
                                        {selectedPet?.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-[#0E2F44] mb-2">{selectedPet?.name}</h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {selectedPet?.breed && (
                                            <Badge className="rounded-full bg-[#F2FAFD] text-[#49B3E8] border-[#49B3E8]/20 font-medium">
                                                {selectedPet.breed}
                                            </Badge>
                                        )}
                                        {selectedPet?.age && (
                                            <Badge className="rounded-full bg-[#F2FAFD] text-[#32C36C] border-[#32C36C]/20 font-medium">
                                                {selectedPet.age} years old
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {profile?.plan_type === 'basic' && !bannerDismissed && (
                                <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-[#0E2F44] to-[#1a4a6b] rounded-[24px] flex flex-col sm:flex-row items-center justify-between shadow-lg shadow-[#0E2F44]/10 relative overflow-hidden group gap-4">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-[#49B3E8]/20 flex items-center justify-center text-[#49B3E8]">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-sm">Grow Your Pet Family?</p>
                                            <p className="text-white/60 text-xs truncate">Upgrade for unlimited pets and features.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 relative z-10 ml-4">
                                        <Button
                                            size="sm"
                                            className="h-9 px-4 rounded-full bg-[#49B3E8] hover:bg-[#A7DCE8] text-white font-bold text-xs shadow-md"
                                            onClick={() => {
                                                navigate('/');
                                                setTimeout(() => {
                                                    const pricing = document.getElementById('pricing');
                                                    if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
                                                }, 100);
                                            }}
                                        >
                                            Upgrade
                                        </Button>
                                        <button
                                            onClick={() => setBannerDismissed(true)}
                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Search */}
                            <div className="relative mt-6">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6F8A96]" />
                                <Input
                                    placeholder="Search timeline..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="h-12 pl-12 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] bg-[#F2FAFD] text-[#0E2F44]"
                                />
                            </div>
                        </div>

                        {/* Timeline Content */}
                        {children}
                    </main>

                    {/* Right Sidebar - Quick Stats - Hidden on tablets/mobile */}
                    <aside className="xl:col-span-3 hidden xl:block">
                        <div className="bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-6 sticky top-4">
                            <h3 className="font-bold text-lg text-[#0E2F44] mb-6">Quick Stats</h3>
                            <div className="space-y-4">
                                {selectedPet?.weight && (
                                    <div className="p-5 bg-gradient-to-br from-[#49B3E8]/5 to-[#A7DCE8]/5 rounded-[20px] border border-[#49B3E8]/10 text-[#0E2F44]">
                                        <p className="text-sm text-[#6F8A96] mb-1">Current Weight</p>
                                        <p className="text-3xl font-bold">
                                            {selectedPet.weight} <span className="text-lg">kg</span>
                                        </p>
                                    </div>
                                )}
                                {selectedPet?.age && (
                                    <div className="p-5 bg-gradient-to-br from-[#32C36C]/5 to-[#49B3E8]/5 rounded-[20px] border border-[#32C36C]/10 text-[#0E2F44]">
                                        <p className="text-sm text-[#6F8A96] mb-1">Age</p>
                                        <p className="text-3xl font-bold">
                                            {selectedPet.age} <span className="text-lg">years</span>
                                        </p>
                                    </div>
                                )}
                                {selectedPet?.microchip_id && (
                                    <div className="p-5 bg-gradient-to-br from-[#F6C343]/5 to-[#49B3E8]/5 rounded-[20px] border border-[#F6C343]/10 text-[#0E2F44]">
                                        <p className="text-sm text-[#6F8A96] mb-1">Microchip ID</p>
                                        <p className="text-sm font-mono font-semibold break-all">
                                            {selectedPet.microchip_id}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
