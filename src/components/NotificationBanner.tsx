import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationProps {
    title: string;
    message: string;
    type?: 'reminder' | 'update' | 'critical';
    onClose: () => void;
    onView?: () => void;
}

export function NotificationBanner({ title, message, type = 'reminder', onClose, onView }: NotificationProps) {
    const bgColor = type === 'critical' ? 'bg-red-50' : 'bg-[#E5F4F9]';
    const textColor = type === 'critical' ? 'text-red-700' : 'text-[#0E2F44]';
    const iconColor = type === 'critical' ? 'text-red-500' : 'text-[#49B3E8]';
    const Icon = type === 'critical' ? AlertCircle : type === 'update' ? Info : Bell;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className={`w-full overflow-hidden`}
        >
            <div className={`container mx-auto px-4 lg:px-8 max-w-[1320px] pt-4`}>
                <div className={`${bgColor} rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white shadow-sm`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${iconColor} shadow-sm`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={`font-bold text-sm ${textColor}`}>{title}</p>
                            <p className="text-[#6F8A96] text-xs leading-relaxed">{message}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {onView && (
                            <Button
                                onClick={onView}
                                size="sm"
                                className="h-9 px-5 rounded-full bg-[#0E2F44] hover:bg-[#1a4a6b] text-white font-bold text-xs"
                            >
                                View Details
                                <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/50 text-[#6F8A96] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
