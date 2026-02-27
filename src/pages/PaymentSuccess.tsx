import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();

    useEffect(() => {
        // Refresh profile to pick up the new plan status
        refreshProfile();

        // Auto-redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, refreshProfile]);

    return (
        <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 text-center"
            >
                <div className="relative mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border-2 border-dashed border-green-200 rounded-full scale-125 opacity-50"
                    />
                </div>

                <h1 className="text-3xl font-bold text-[#0E2F44] mb-4">Payment Successful!</h1>
                <p className="text-[#6F8A96] mb-8">
                    You've successfully upgraded to <strong>PetVault Pro</strong>. Welcome to the family!
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                        <Sparkles className="w-5 h-5 text-[#F6C343]" />
                        <span className="text-sm font-medium text-[#0E2F44]">Unlimited pet profiles unlocked</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                        <Sparkles className="w-5 h-5 text-[#F6C343]" />
                        <span className="text-sm font-medium text-[#0E2F44]">Unlimited document uploads activated</span>
                    </div>
                </div>

                <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-14 rounded-full bg-[#49B3E8] hover:bg-[#3ca1d4] text-white font-bold text-lg flex items-center justify-center gap-2"
                >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="mt-6 text-xs text-[#BACCD4] uppercase tracking-widest font-bold">
                    Redirecting in a few seconds...
                </p>
            </motion.div>
        </div>
    );
}
