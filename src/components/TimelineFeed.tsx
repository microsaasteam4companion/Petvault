import { useEffect, useState } from 'react';
import { supabase, type TimelineEntry, type File as FileType } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import {
    Syringe,
    Heart,
    Bone,
    Activity,
    Stethoscope,
    FileText,
    Download,
    ChevronDown,
    ChevronUp,
    Paperclip,
} from 'lucide-react';

interface TimelineFeedProps {
    petId: string;
    category?: string;
    searchQuery?: string;
}

interface EntryWithFiles extends TimelineEntry {
    files?: FileType[];
}

const categoryConfig: Record<string, { color: string; icon: any }> = {
    vaccine: { color: 'bg-blue-100 text-blue-700', icon: Syringe },
    illness: { color: 'bg-red-100 text-red-700', icon: Heart },
    food: { color: 'bg-orange-100 text-orange-700', icon: Bone },
    weight: { color: 'bg-green-100 text-green-700', icon: Activity },
    behavior: { color: 'bg-purple-100 text-purple-700', icon: Heart },
    vet_visit: { color: 'bg-teal-100 text-teal-700', icon: Stethoscope },
    other: { color: 'bg-gray-100 text-gray-700', icon: FileText },
};

export function TimelineFeed({ petId, category = 'all', searchQuery = '' }: TimelineFeedProps) {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [entries, setEntries] = useState<EntryWithFiles[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 20;

    const isBasic = profile?.plan_type === 'basic';

    useEffect(() => {
        if (petId) {
            setPage(1);
            setHasMore(true);
            loadEntries(true);
        }
    }, [petId, category, searchQuery]);

    const loadEntries = async (isInitial = false) => {
        if (isInitial) setLoading(true);
        try {
            let query = supabase
                .from('timeline_entries')
                .select('*')
                .eq('pet_id', petId);

            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            if (searchQuery) {
                if (isBasic) {
                    // Basic: Only title
                    query = query.ilike('title', `%${searchQuery}%`);
                } else {
                    // Pro: Full text search (title + description)
                    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
                }
            }

            const { data: entriesData, error: entriesError } = await query
                .order('date', { ascending: false })
                .range(0, ITEMS_PER_PAGE - 1);

            if (entriesError) throw entriesError;

            if (!entriesData || entriesData.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            // Load files for each entry
            if (entriesData) {
                const entriesWithFiles = await Promise.all(
                    entriesData.map(async (entry) => {
                        const { data: files } = await supabase
                            .from('files')
                            .select('*')
                            .eq('entry_id', entry.id);
                        return { ...entry, files: files || [] };
                    })
                );
                setEntries(entriesWithFiles);
            } else {
                setEntries([]);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load timeline entries.',
            });
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    const loadMore = async () => {
        try {
            let query = supabase
                .from('timeline_entries')
                .select('*')
                .eq('pet_id', petId);

            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            if (searchQuery) {
                if (isBasic) {
                    query = query.ilike('title', `%${searchQuery}%`);
                } else {
                    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
                }
            }

            const { data: moreEntries, error } = await query
                .order('date', { ascending: false })
                .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

            if (error) throw error;

            if (!moreEntries || moreEntries.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (moreEntries) {
                const entriesWithFiles = await Promise.all(
                    moreEntries.map(async (entry) => {
                        const { data: files } = await supabase
                            .from('files')
                            .select('*')
                            .eq('entry_id', entry.id);
                        return { ...entry, files: files || [] };
                    })
                );
                setEntries((prev) => [...prev, ...entriesWithFiles]);
                setPage((prev) => prev + 1);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to load more entries.',
            });
        }
    };

    const toggleExpand = (entryId: string) => {
        setExpandedEntries((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(entryId)) {
                newSet.delete(entryId);
            } else {
                newSet.add(entryId);
            }
            return newSet;
        });
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <Card className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold">No entries yet</h3>
                    <p className="text-muted-foreground max-w-md">
                        Start building your pet's health timeline by adding your first entry.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {entries.map((entry) => {
                const config = categoryConfig[entry.category] || categoryConfig.other;
                const Icon = config.icon;
                const isExpanded = expandedEntries.has(entry.id);

                return (
                    <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className={`p-2 rounded-lg ${config.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="font-semibold text-lg">{entry.title}</h3>
                                            {entry.files && entry.files.length > 0 && (
                                                <Paperclip className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary" className={config.color}>
                                                {entry.category.replace('_', ' ')}
                                            </Badge>
                                            <span>•</span>
                                            <span>{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExpand(entry.id)}
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>

                            {/* Short description (always visible) */}
                            {!isExpanded && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {entry.description}
                                </p>
                            )}

                            {/* Expanded content */}
                            {isExpanded && (
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Description</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {entry.description}
                                        </p>
                                    </div>

                                    {/* Metadata */}
                                    {entry.metadata && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {entry.metadata.weight_value && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs text-muted-foreground">Weight</p>
                                                    <p className="font-semibold">{entry.metadata.weight_value} kg</p>
                                                </div>
                                            )}
                                            {entry.metadata.vet_name && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs text-muted-foreground">Vet</p>
                                                    <p className="font-semibold">{entry.metadata.vet_name}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Files */}
                                    {entry.files && entry.files.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3">Attachments</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {entry.files.map((file) => (
                                                    <div
                                                        key={file.id}
                                                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                                    >
                                                        {file.file_type.startsWith('image/') ? (
                                                            <img
                                                                src={file.file_url}
                                                                alt={file.file_name}
                                                                className="w-full h-32 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                                                <FileText className="w-12 h-12 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="p-3 bg-white">
                                                            <p className="text-xs truncate mb-2">{file.file_name}</p>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => downloadFile(file.file_url, file.file_name)}
                                                                className="w-full"
                                                            >
                                                                <Download className="w-3 h-3 mr-2" />
                                                                Download
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                );
            })}

            {hasMore && (
                <div className="text-center py-6">
                    <Button
                        onClick={loadMore}
                        variant="outline"
                        className="bg-white hover:bg-gray-50"
                    >
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
}
