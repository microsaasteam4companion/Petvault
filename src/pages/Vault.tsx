import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type File as FileType } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Search,
    Download,
    FileText,
    Image as ImageIcon,
    FileIcon,
    Trash2,
    Grid3x3,
    List,
    PawPrint,
    Upload,
    Lock,
} from 'lucide-react';
import { UpgradeModal } from '@/components/UpgradeModal';
import { format } from 'date-fns';
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

interface FileWithEntry extends FileType {
    entry?: {
        title: string;
        category: string;
        date: string;
    };
}

type ViewMode = 'grid' | 'list';

export default function Vault() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [files, setFiles] = useState<FileWithEntry[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<FileWithEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<{ id: string; url: string } | null>(null);

    const isBasic = profile?.plan_type === 'basic';

    useEffect(() => {
        if (isBasic) {
            setViewMode('grid');
        }
    }, [isBasic]);

    useEffect(() => {
        if (user) {
            loadFiles();
        }
    }, [user]);

    useEffect(() => {
        filterAndSortFiles();
    }, [files, searchQuery, categoryFilter, sortBy]);

    const loadFiles = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data: pets, error: petsError } = await supabase
                .from('pets')
                .select('id')
                .eq('user_id', user.id);

            if (petsError) throw petsError;

            if (!pets || pets.length === 0) {
                setFiles([]);
                return;
            }

            const petIds = pets.map((p) => p.id);

            const { data: entries, error: entriesError } = await supabase
                .from('timeline_entries')
                .select('id, title, category, date')
                .in('pet_id', petIds);

            if (entriesError) throw entriesError;

            if (!entries || entries.length === 0) {
                setFiles([]);
                return;
            }

            const entryIds = entries.map((e) => e.id);

            const { data: filesData, error: filesError } = await supabase
                .from('files')
                .select('*')
                .in('entry_id', entryIds);

            if (filesError) throw filesError;

            const filesWithEntries =
                filesData?.map((file) => ({
                    ...file,
                    entry: entries.find((e) => e.id === file.entry_id),
                })) || [];

            setFiles(filesWithEntries);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load files.',
            });
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortFiles = () => {
        let result = [...files];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (file) =>
                    file.file_name.toLowerCase().includes(query) ||
                    file.entry?.title?.toLowerCase().includes(query)
            );
        }

        if (categoryFilter !== 'all') {
            result = result.filter((file) => file.entry?.category === categoryFilter);
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
                case 'date_asc':
                    return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
                case 'name_asc':
                    return a.file_name.localeCompare(b.file_name);
                case 'name_desc':
                    return b.file_name.localeCompare(a.file_name);
                default:
                    return 0;
            }
        });

        setFilteredFiles(result);
    };

    const downloadFile = (url: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteFile = async (fileId: string, fileUrl: string) => {
        try {
            const urlParts = fileUrl.split('/');
            const bucketIndex = urlParts.findIndex((part) => part === 'entry-files');
            const filePath = urlParts.slice(bucketIndex + 1).join('/');

            const { error: storageError } = await supabase.storage
                .from('entry-files')
                .remove([filePath]);

            if (storageError) throw storageError;

            const { error: dbError } = await supabase.from('files').delete().eq('id', fileId);

            if (dbError) throw dbError;

            setFiles((prev) => prev.filter((f) => f.id !== fileId));

            toast({
                title: 'Success',
                description: 'File has been deleted.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to delete file.',
            });
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return ImageIcon;
        if (fileType === 'application/pdf') return FileText;
        return FileIcon;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            vaccine: 'bg-[#49B3E8]/10 text-[#49B3E8] border-[#49B3E8]/20',
            illness: 'bg-red-50 text-red-600 border-red-200',
            food: 'bg-orange-50 text-orange-600 border-orange-200',
            weight: 'bg-[#32C36C]/10 text-[#32C36C] border-[#32C36C]/20',
            behavior: 'bg-purple-50 text-purple-600 border-purple-200',
            vet_visit: 'bg-[#F6C343]/10 text-[#F6C343] border-[#F6C343]/20',
            other: 'bg-gray-50 text-gray-600 border-gray-200',
        };
        return colors[category] || colors.other;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F2FAFD] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#49B3E8] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#6F8A96] font-medium">Loading your vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2FAFD] font-poppins">
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                title="Unlock List View"
                description="The List View is a Pro feature. Upgrade to easily sort and manage large document collections."
            />

            <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
                <AlertDialogContent className="max-w-[400px] w-[92%] rounded-[32px] p-8 border-none shadow-[0_25px_80px_rgba(0,0,0,0.15)] flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 shrink-0">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <AlertDialogHeader className="text-center">
                        <AlertDialogTitle className="text-2xl font-extrabold text-[#0E2F44]">Delete Document?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6F8A96] mt-3 leading-relaxed">
                            This will permanently remove this file from your vault. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-6">
                        <AlertDialogCancel className="rounded-full h-12 px-8 border-[#E5F4F9] text-[#6F8A96] font-bold hover:bg-[#F2FAFD] hover:text-[#0E2F44]">
                            Keep File
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (fileToDelete) deleteFile(fileToDelete.id, fileToDelete.url);
                                setFileToDelete(null);
                            }}
                            className="rounded-full h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-200"
                        >
                            Yes, Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Header */}
            <header className="bg-white border-b border-[#E5F4F9] sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8 max-w-[1320px]">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/dashboard')}
                                className="rounded-full hover:bg-[#F2FAFD]"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F6C343] flex items-center justify-center">
                                    <PawPrint className="w-5 h-5 text-[#0E2F44]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#0E2F44]">
                                        Document Vault
                                    </h1>
                                    <p className="text-sm text-[#6F8A96] hidden lg:block">
                                        All your pet's records, safely stored in one place
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Badge className="rounded-full bg-[#49B3E8]/10 text-[#49B3E8] border-[#49B3E8]/20 px-4 py-1.5">
                            {files.length} {files.length === 1 ? 'file' : 'files'}
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 lg:px-8 max-w-[1320px] py-8">
                {/* Filters & Controls */}
                <div className="bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6F8A96]" />
                            <Input
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 pl-12 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] bg-[#F2FAFD]"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="h-12 rounded-full border-2 border-[#E5F4F9] bg-[#F2FAFD]">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="vaccine">Vaccines</SelectItem>
                                <SelectItem value="illness">Illness</SelectItem>
                                <SelectItem value="food">Food Changes</SelectItem>
                                <SelectItem value="weight">Weight</SelectItem>
                                <SelectItem value="behavior">Behavior</SelectItem>
                                <SelectItem value="vet_visit">Vet Visits</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-12 rounded-full border-2 border-[#E5F4F9] bg-[#F2FAFD]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date_desc">Newest First</SelectItem>
                                <SelectItem value="date_asc">Oldest First</SelectItem>
                                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 justify-end md:justify-start">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={`h-12 px-6 rounded-full transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] text-white'
                                    : 'border-2 border-[#E5F4F9] text-[#6F8A96] hover:bg-[#F2FAFD]'
                                    }`}
                            >
                                <Grid3x3 className="w-4 h-4 mr-2" />
                                Grid
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    if (isBasic) {
                                        setShowUpgradeModal(true);
                                    } else {
                                        setViewMode('list');
                                    }
                                }}
                                className={`h-12 px-6 rounded-full transition-all ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] text-white'
                                    : 'border-2 border-[#E5F4F9] text-[#6F8A96] hover:bg-[#F2FAFD]'
                                    }`}
                            >
                                {isBasic ? <Lock className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
                                List
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredFiles.length === 0 ? (
                    <div className="bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-16 text-center">
                        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#49B3E8]/10 to-[#A7DCE8]/10 rounded-full flex items-center justify-center">
                                <FileText className="w-12 h-12 text-[#49B3E8]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#0E2F44] mb-2">No documents yet</h3>
                                <p className="text-[#6F8A96]">
                                    {searchQuery || categoryFilter !== 'all'
                                        ? 'Try adjusting your filters to see more files'
                                        : "Upload your pet's first medical record to get started"}
                                </p>
                            </div>
                            {!searchQuery && categoryFilter === 'all' && (
                                <Button
                                    onClick={() => navigate('/dashboard')}
                                    className="h-12 px-8 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold"
                                >
                                    <Upload className="w-5 h-5 mr-2" />
                                    Go to Timeline
                                </Button>
                            )}
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFiles.map((file) => {
                            const Icon = getFileIcon(file.file_type);
                            return (
                                <div
                                    key={file.id}
                                    className="bg-white rounded-[22px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* File Preview */}
                                    <div className="h-48 bg-gradient-to-br from-[#F2FAFD] to-[#E5F4F9] flex items-center justify-center overflow-hidden">
                                        {file.file_type.startsWith('image/') ? (
                                            <img
                                                src={file.file_url}
                                                alt={file.file_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Icon className="w-16 h-16 text-[#49B3E8]" />
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="p-5">
                                        <h3 className="font-semibold text-[#0E2F44] text-sm truncate mb-3">
                                            {file.file_name}
                                        </h3>
                                        {file.entry && (
                                            <div className="space-y-2 mb-4">
                                                <p className="text-xs text-[#6F8A96] truncate">
                                                    {file.entry.title}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={`text-xs rounded-full border ${getCategoryColor(
                                                            file.entry.category
                                                        )}`}
                                                    >
                                                        {file.entry.category.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-[#6F8A96]">
                                                    {format(new Date(file.entry.date), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                        )}
                                        <div className="text-xs text-[#6F8A96] mb-4">
                                            {(file.file_size / 1024 / 1024).toFixed(2)} MB
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => downloadFile(file.file_url, file.file_name)}
                                                className="flex-1 h-9 rounded-full bg-[#49B3E8] hover:bg-[#49B3E8]/90 text-white"
                                            >
                                                <Download className="w-3.5 h-3.5 mr-1" />
                                                Download
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setFileToDelete({ id: file.id, url: file.file_url })}
                                                className="h-9 w-9 p-0 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className="space-y-3">
                        {filteredFiles.map((file) => {
                            const Icon = getFileIcon(file.file_type);
                            return (
                                <div
                                    key={file.id}
                                    className="bg-white rounded-[18px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:bg-[#F2FAFD]/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#49B3E8]/10 to-[#A7DCE8]/10 rounded-full flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-[#49B3E8]" />
                                        </div>

                                        {/* File Name */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#0E2F44] truncate">
                                                {file.file_name}
                                            </h3>
                                            {file.entry && (
                                                <p className="text-sm text-[#6F8A96] truncate">
                                                    {file.entry.title}
                                                </p>
                                            )}
                                        </div>

                                        {/* Category */}
                                        {file.entry && (
                                            <Badge
                                                className={`hidden sm:inline-flex rounded-full border ${getCategoryColor(
                                                    file.entry.category
                                                )}`}
                                            >
                                                {file.entry.category.replace('_', ' ')}
                                            </Badge>
                                        )}

                                        {/* Date */}
                                        <div className="hidden md:block text-sm text-[#6F8A96] w-32 text-right">
                                            {file.entry && format(new Date(file.entry.date), 'MMM dd, yyyy')}
                                        </div>

                                        {/* Size */}
                                        <div className="hidden lg:block text-sm text-[#6F8A96] w-24 text-right">
                                            {(file.file_size / 1024 / 1024).toFixed(2)} MB
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => downloadFile(file.file_url, file.file_name)}
                                                className="h-9 px-4 rounded-full bg-[#49B3E8] hover:bg-[#49B3E8]/90 text-white"
                                            >
                                                <Download className="w-4 h-4 sm:mr-2" />
                                                <span className="hidden sm:inline">Download</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setFileToDelete({ id: file.id, url: file.file_url })}
                                                className="h-9 w-9 p-0 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
