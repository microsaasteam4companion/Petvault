import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, CheckCircle2, Crown, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

const proFeatures = [
    "Unlimited Pet Profiles",
    "Unlimited Document Uploads",
    "Recurring & Email Reminders",
    "PDF Export & Advanced Search",
    "Personal AI Assistant"
];

export function UpgradeModal({
    open,
    onOpenChange,
    title = "Upgrade to Pro",
    description = "Free plan allows up to 15 documents. Upgrade to store unlimited health records."
}: UpgradeModalProps) {
    const navigate = useNavigate();

    const handleUpgradeRedirect = () => {
        onOpenChange(false);
        navigate('/');
        // Scroll to pricing after a small delay to ensure navigation is complete
        setTimeout(() => {
            const pricingElement = document.getElementById('pricing');
            if (pricingElement) {
                pricingElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] w-[92%] p-0 overflow-hidden border-none rounded-[28px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
                {/* Visual Header - Compact */}
                <div className="relative h-32 bg-[#0E2F44] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#49B3E8] rounded-full blur-2xl"></div>
                    </div>

                    <div className="z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="w-14 h-14 bg-gradient-to-br from-[#F6C343] to-[#E5A500] rounded-2xl flex items-center justify-center shadow-lg mb-2"
                        >
                            <Crown className="w-7 h-7 text-[#0E2F44]" />
                        </motion.div>
                        <Badge className="bg-[#49B3E8] text-white border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest">
                            Pro Feature
                        </Badge>
                    </div>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-[#0E2F44] mb-2">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-[#6F8A96] text-sm leading-relaxed">
                            {description}
                        </DialogDescription>
                    </div>

                    {/* Features List - More compact */}
                    <div className="grid grid-cols-1 gap-2 mb-6">
                        {proFeatures.slice(0, 4).map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F2FAFD] border border-[#E5F4F9]"
                            >
                                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#32C36C] shadow-sm shrink-0">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <span className="text-xs font-semibold text-[#0E2F44]">{feature}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full h-12 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-bold text-base flex items-center justify-center gap-2 group"
                            onClick={handleUpgradeRedirect}
                        >
                            <span>Upgrade to Pro — $5/month</span>
                            <Zap className="w-4 h-4 group-hover:fill-current transition-all" />
                        </Button>
                        <button
                            className="w-full text-center text-[#6F8A96] hover:text-[#0E2F44] font-bold text-xs transition-colors py-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Secure Badge - Shorter */}
                <div className="bg-[#F8FAFB] py-3 px-6 border-t border-[#F1F5F9] flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F6C343]" />
                    <span className="text-[10px] font-bold text-[#BACCD4] uppercase tracking-wider">
                        Trusted by 10,000+ Pet Parents
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </div>
    );
}
