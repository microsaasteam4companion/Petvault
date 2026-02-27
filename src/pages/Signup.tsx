import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Shield, FolderOpen, Search } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Passwords do not match.',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Password must be at least 6 characters long.',
            });
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password);
            toast({
                title: 'Account created! 🎉',
                description: 'Please check your email to verify your account.',
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to create account. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Shield,
            title: 'Secure & Private',
            description: "Your pet's records are encrypted and only accessible by you.",
        },
        {
            icon: FolderOpen,
            title: 'All In One Place',
            description: 'Store vaccines, visits, weight logs, and reports in a single timeline.',
        },
        {
            icon: Search,
            title: 'Easy To Find',
            description: 'Search and filter any moment instantly.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F2FAFD] font-poppins flex items-center py-12 lg:py-0">
            <div className="container mx-auto px-4 h-full flex items-center">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 max-w-[1100px] mx-auto w-full">

                    {/* LEFT: Form Card */}
                    <div className="w-full lg:max-w-[420px] flex-shrink-0 mx-auto lg:mx-0">
                        <div className="bg-white rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-[28px] md:p-[36px] lg:p-[40px]">
                            {/* Logo Row */}
                            <div className="flex items-center justify-center gap-2 mb-[16px] flex-shrink-0 pt-[24px]">
                                <img
                                    src="/logo.png"
                                    alt=""
                                    className="h-[28px] w-auto flex-shrink-0"
                                    style={{ objectFit: 'contain' }}
                                />
                                <span className="text-[16px] font-semibold text-[#0E2F44] tracking-tight">PetVault</span>
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-[24px]">
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#0E2F44] mb-[8px] leading-tight">
                                    Start Your Pet's Wellness Journey
                                </h1>
                                <p className="text-sm text-[#6F8A96] leading-relaxed">
                                    Create your private pet health timeline in minutes.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-[#0E2F44]">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] transition-all bg-[#F2FAFD] text-[#0E2F44] placeholder:text-[#6F8A96]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-[#0E2F44]">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="At least 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] transition-all bg-[#F2FAFD] text-[#0E2F44]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#0E2F44]">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-14 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] transition-all bg-[#F2FAFD] text-[#0E2F44]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-full bg-gradient-to-r from-[#32C36C] to-[#49B3E8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold text-base mt-4"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating account...
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Create Free Account
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#E5F4F9]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-[#6F8A96]">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign In */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => signInWithGoogle()}
                                className="w-full h-12 rounded-full border-2 border-[#E5F4F9] hover:bg-[#F2FAFD] transition-all flex items-center justify-center gap-2 font-semibold text-[#0E2F44]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>

                            {/* Footer Links */}
                            <div className="mt-5 text-center space-y-3">
                                <p className="text-sm text-[#6F8A96]">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-[#49B3E8] hover:text-[#32C36C] font-semibold transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                                <Link
                                    to="/"
                                    className="inline-block text-sm text-[#6F8A96] hover:text-[#0E2F44] transition-colors"
                                >
                                    ← Back to home
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Feature Cards */}
                    <div className="w-full lg:flex-1 max-w-lg">
                        <div className="space-y-6">
                            <div className="text-center lg:text-left mb-8">
                                <h2 className="text-3xl font-bold text-[#0E2F44] mb-3">
                                    Everything you need for your pet's health
                                </h2>
                                <p className="text-[#6F8A96] text-lg">
                                    Keep track of your furry friend's wellness journey with ease
                                </p>
                            </div>

                            <div className="space-y-4">
                                {features.map((feature, idx) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-[22px] p-6 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#49B3E8]/10 to-[#A7DCE8]/10 flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-[#49B3E8]" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-[#0E2F44] mb-2">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-sm text-[#6F8A96] leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
