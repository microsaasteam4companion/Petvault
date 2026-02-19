import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
import {
    X,
    Upload,
    FileIcon,
    Lock,
    Bell,
    Mail,
    RefreshCw,
    Plus,
    Syringe,
    Heart,
    Bone,
    Activity,
    Stethoscope,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { UpgradeModal } from './UpgradeModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddEntryModalProps {
    open: boolean;
    onClose: () => void;
    petId: string;
}

const visualCategories = [
    { id: 'vaccine', label: 'Vaccines', icon: Syringe, color: '#49B3E8', bgColor: '#F2FAFD' },
    { id: 'illness', label: 'Illness', icon: Heart, color: '#FF6B6B', bgColor: '#FFF5F5' },
    { id: 'food', label: 'Food', icon: Bone, color: '#F6C343', bgColor: '#FEF9EB' },
    { id: 'weight', label: 'Weight', icon: Activity, color: '#32C36C', bgColor: '#F0FBF4' },
    { id: 'behavior', label: 'Behavior', icon: Heart, color: '#A78BFA', bgColor: '#F5F3FF' },
    { id: 'vet_visit', label: 'Vet Visit', icon: Stethoscope, color: '#49B3E8', bgColor: '#F2FAFD' },
];

export function AddEntryModal({ open, onClose, petId }: AddEntryModalProps) {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fileCount, setFileCount] = useState(0);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        weight_value: '',
        vet_name: '',
        reminder_enabled: false,
        reminder_date: '',
        reminder_type: 'in-app' as 'in-app' | 'email',
        reminder_recurring: false,
    });
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (open && user) {
            loadFileCount();
        }
    }, [open, user]);

    const loadFileCount = async () => {
        if (!user) return;
        try {
            const { data: entries } = await supabase.from('timeline_entries').select('id').eq('pet_id', petId);
            if (!entries || entries.length === 0) return;
            const entryIds = entries.map(e => e.id);
            const { count, error } = await supabase
                .from('files')
                .select('*', { count: 'exact', head: true })
                .in('entry_id', entryIds);
            if (!error && count !== null) {
                setFileCount(count);
            }
        } catch (err) {
            console.error('Error loading file count:', err);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png'],
            'application/pdf': ['.pdf'],
        },
        maxSize: 10485760,
        disabled: profile?.plan_type === 'basic' && fileCount >= 15,
        onDrop: (acceptedFiles) => {
            if (profile?.plan_type === 'basic' && fileCount + files.length + acceptedFiles.length > 15) {
                setShowUpgradeModal(true);
                return;
            }
            setFiles((prev) => [...prev, ...acceptedFiles]);
        },
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.category || !formData.title || !formData.description) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill in required fields.' });
            return;
        }

        setLoading(true);
        try {
            const metadata: any = {};
            if (formData.weight_value) metadata.weight_value = parseFloat(formData.weight_value);
            if (formData.vet_name) metadata.vet_name = formData.vet_name;

            const { data: entry, error: entryError } = await supabase
                .from('timeline_entries')
                .insert({
                    pet_id: petId,
                    category: formData.category,
                    title: formData.title,
                    description: formData.description,
                    date: formData.date,
                    metadata: Object.keys(metadata).length > 0 ? metadata : null,
                })
                .select()
                .single();

            if (entryError) throw entryError;

            if (formData.reminder_enabled && formData.reminder_date) {
                await supabase.from('reminders').insert({
                    user_id: user.id,
                    pet_id: petId,
                    title: `Follow up: ${formData.title}`,
                    date: formData.reminder_date,
                    type: formData.reminder_type,
                    recurring: formData.reminder_recurring,
                    recurring_interval: formData.reminder_recurring ? 'yearly' : null,
                });
            }

            if (files.length > 0) {
                for (const file of files) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${user.id}/${entry.id}/${Date.now()}.${fileExt}`;
                    await supabase.storage.from('entry-files').upload(fileName, file);
                    const { data: { publicUrl } } = supabase.storage.from('entry-files').getPublicUrl(fileName);
                    await supabase.from('files').insert({
                        entry_id: entry.id,
                        file_url: publicUrl,
                        file_type: file.type,
                        file_name: file.name,
                        file_size: file.size,
                    });
                }
            }

            toast({ title: 'Success!', description: 'Entry added.' });
            setFormData({
                category: '',
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                weight_value: '',
                vet_name: '',
                reminder_enabled: false,
                reminder_date: '',
                reminder_type: 'in-app',
                reminder_recurring: false,
            });
            setFiles([]);
            onClose();
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                title="Pro storage features"
                description="Upgrade to Pro for unlimited document storage and advanced health tools."
            />
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[640px] w-full p-0 overflow-hidden border-none rounded-[28px] bg-white shadow-2xl max-h-[95vh] flex flex-col">
                    {/* Compact Header */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 relative z-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#49B3E8] shrink-0">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-[#0E2F44]">Add Health Entry</DialogTitle>
                                <DialogDescription className="text-[11px] text-[#6F8A96]">Log your pet's health milestones</DialogDescription>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 text-[#6F8A96] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                        <div className="space-y-6">
                            {/* Fast Category Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {visualCategories.map((cat) => {
                                    const Icon = cat.icon;
                                    const isSelected = formData.category === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                            className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all border-2 ${isSelected ? 'border-[#49B3E8] bg-white shadow-sm' : 'border-transparent bg-[#f8fafc]'
                                                }`}
                                        >
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isSelected ? cat.bgColor : 'white', color: cat.color }}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-bold text-[#6F8A96]">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Core Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-full">
                                    <Label className="text-xs font-bold text-[#0E2F44]">Title *</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Annual Checkup"
                                        className="h-10 rounded-xl border-[#E5F4F9] text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-[#0E2F44]">Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="h-10 rounded-xl border-[#E5F4F9] text-sm"
                                        required
                                    />
                                </div>
                                {formData.category === 'weight' && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-[#0E2F44]">Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            value={formData.weight_value}
                                            onChange={(e) => setFormData({ ...formData, weight_value: e.target.value })}
                                            className="h-10 rounded-xl border-[#E5F4F9] text-sm"
                                        />
                                    </div>
                                )}
                                {formData.category === 'vet_visit' && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-[#0E2F44]">Vet Name</Label>
                                        <Input
                                            value={formData.vet_name}
                                            onChange={(e) => setFormData({ ...formData, vet_name: e.target.value })}
                                            className="h-10 rounded-xl border-[#E5F4F9] text-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#0E2F44]">Notes *</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[80px] rounded-xl border-[#E5F4F9] text-sm resize-none"
                                    required
                                />
                            </div>

                            {/* Compact Upload Section */}
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-[20px] p-5 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[#49B3E8] bg-[#F2FAFD]' : 'border-slate-100 bg-slate-50/50'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="w-5 h-5 mx-auto mb-2 text-[#49B3E8]" />
                                <p className="text-xs font-bold text-[#0E2F44]">Drop documents here</p>
                                <p className="text-[10px] text-[#6F8A96]">JPG, PNG, PDF (10MB max)</p>
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileIcon className="w-4 h-4 text-[#49B3E8] shrink-0" />
                                                <span className="text-xs font-medium truncate">{file.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFile(i)} className="p-1 hover:text-red-500">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Compact Reminders */}
                            <div className="p-4 bg-[#F2FAFD]/50 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Bell className="w-4 h-4 text-[#49B3E8]" />
                                        <span className="text-xs font-bold text-[#0E2F44]">Enable Health Reminder</span>
                                    </div>
                                    <Switch
                                        checked={formData.reminder_enabled}
                                        onCheckedChange={(c) => setFormData({ ...formData, reminder_enabled: c })}
                                    />
                                </div>
                                {formData.reminder_enabled && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase font-bold text-[#6F8A96]">Date</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.reminder_date}
                                                    onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                                                    className="h-9 bg-white text-xs rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase font-bold text-[#6F8A96]">Type</Label>
                                                <Select
                                                    value={formData.reminder_type}
                                                    onValueChange={(v: any) => setFormData({ ...formData, reminder_type: v })}
                                                >
                                                    <SelectTrigger className="h-9 bg-white text-xs rounded-lg">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="in-app">In-App</SelectItem>
                                                        <SelectItem value="email" disabled={profile?.plan_type === 'basic'}>
                                                            Email {profile?.plan_type === 'basic' && '(Pro Only)'}
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className={`w-3.5 h-3.5 ${profile?.plan_type === 'basic' ? 'text-slate-300' : 'text-[#49B3E8]'}`} />
                                                <span className={`text-[11px] font-bold ${profile?.plan_type === 'basic' ? 'text-slate-400' : 'text-[#0E2F44]'}`}>
                                                    Recurring Yearly {profile?.plan_type === 'basic' && '(Pro)'}
                                                </span>
                                            </div>
                                            <Switch
                                                checked={formData.reminder_recurring}
                                                disabled={profile?.plan_type === 'basic'}
                                                onCheckedChange={(c) => setFormData({ ...formData, reminder_recurring: c })}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </form>

                    <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-white rounded-b-[28px]">
                        <button type="button" onClick={onClose} className="text-xs font-bold text-[#6F8A96] hover:text-[#0E2F44]">Cancel</button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-10 px-8 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] text-white font-bold text-sm shadow-md"
                        >
                            {loading ? "Saving..." : "Save Entry"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
