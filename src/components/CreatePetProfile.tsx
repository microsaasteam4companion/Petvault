import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Camera, PawPrint, X, Sparkles } from 'lucide-react';

interface CreatePetProfileProps {
    open: boolean;
    onComplete: () => void;
    canCancel?: boolean;
    onCancel?: () => void;
}

export function CreatePetProfile({ open, onComplete, canCancel = false, onCancel }: CreatePetProfileProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        age: '',
        gender: '',
        weight: '',
        microchip_id: '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.name) {
            toast({ variant: 'destructive', title: 'Name required', description: 'Please give your pet a name!' });
            return;
        }

        setLoading(true);
        try {
            let photoUrl = null;

            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('pet-photos')
                    .upload(fileName, photoFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage
                    .from('pet-photos')
                    .getPublicUrl(fileName);
                photoUrl = publicUrl;
            }

            const { error: insertError } = await supabase.from('pets').insert({
                user_id: user.id,
                name: formData.name,
                breed: formData.breed || null,
                age: formData.age ? parseInt(formData.age) : null,
                gender: formData.gender || null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                microchip_id: formData.microchip_id || null,
                photo_url: photoUrl,
            });

            if (insertError) throw insertError;

            toast({ title: 'Welcome Home!', description: `${formData.name} is now part of the family.` });
            onComplete();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && canCancel && onCancel?.()}>
            <DialogContent className="sm:max-w-[600px] w-[95%] p-0 overflow-hidden border-none rounded-[32px] bg-white shadow-[0_32px_120px_rgba(0,0,0,0.15)] max-h-[95vh] flex flex-col">
                {/* Background Sparkles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#49B3E8] rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[200px] h-[200px] bg-[#F6C343] rounded-full blur-[60px]"></div>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center p-6 sm:p-10"
                    >
                        {/* Header */}
                        <header className="text-center mb-8 relative w-full shrink-0">
                            <div className="w-16 h-16 bg-[#F2FAFD] rounded-2xl flex items-center justify-center text-[#49B3E8] mx-auto mb-4 shadow-sm border border-[#E5F4F9]">
                                <PawPrint className="w-8 h-8" />
                            </div>
                            <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-[#0E2F44] tracking-tight mb-2">Create Pet Profile</DialogTitle>
                            <DialogDescription className="text-[#6F8A96] text-sm">Every great journey begins with a first step.</DialogDescription>
                        </header>

                        {/* Photo Upload - Premium Circle */}
                        <div className="relative mb-8 group">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#F8FAFB] relative flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 border-dashed border-slate-200">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Pet Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-[#A7DCE8]">
                                        <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
                                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Photo</span>
                                    </div>
                                )}
                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all opacity-0 hover:opacity-100">
                                    <Input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                    <Camera className="w-8 h-8 text-white" />
                                </label>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-9 h-9 sm:w-10 sm:h-10 bg-[#49B3E8] rounded-full flex items-center justify-center text-white border-4 border-white shadow-md">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                {/* Form Fields */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label className="text-[11px] font-bold text-[#0E2F44] uppercase tracking-wide px-1">Pet Name *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Buddy, Luna..."
                                        className="h-12 rounded-2xl border-[#E5F4F9] focus:ring-4 focus:ring-[#49B3E8]/10 text-sm sm:text-base"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-[#0E2F44] uppercase tracking-wide px-1">Breed</Label>
                                    <Input
                                        value={formData.breed}
                                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                        placeholder="Golden Retriever..."
                                        className="h-12 rounded-2xl border-[#E5F4F9] text-sm sm:text-base"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-[#0E2F44] uppercase tracking-wide px-1">Age (Years)</Label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="3"
                                        className="h-12 rounded-2xl border-[#E5F4F9] text-sm sm:text-base"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-[#0E2F44] uppercase tracking-wide px-1">Gender</Label>
                                    <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                                        <SelectTrigger className="h-12 rounded-2xl border-[#E5F4F9] text-sm sm:text-base">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-[#0E2F44] uppercase tracking-wide px-1">Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        placeholder="12.5"
                                        className="h-12 rounded-2xl border-[#E5F4F9] text-sm sm:text-base"
                                    />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label className="text-[11px] font-bold text-[#0E2F44] uppercase tracking-wide px-1">Microchip ID (Optional)</Label>
                                    <Input
                                        value={formData.microchip_id}
                                        onChange={(e) => setFormData({ ...formData, microchip_id: e.target.value })}
                                        placeholder="982..."
                                        className="h-12 rounded-2xl border-[#E5F4F9] text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-14 w-full rounded-2xl bg-[#0E2F44] hover:bg-[#1a4a6b] text-white font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : "Create Pet Profile"}
                                </Button>
                                {canCancel && (
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="text-[#6F8A96] font-bold text-sm h-10 hover:text-[#0E2F44] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Fixed Close Button for better mobile UX */}
                {canCancel && (
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#E5F4F9] text-[#6F8A96] hover:text-[#0E2F44] transition-all z-50 shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </DialogContent>
        </Dialog>
    );
}
