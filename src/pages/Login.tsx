import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn(email, password);
            toast({
                title: 'Welcome back! 🐾',
                description: 'You have successfully logged in.',
            });
            navigate('/dashboard');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to sign in. Please check your credentials.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-[#F2FAFD] font-poppins flex items-center">
            {/* Desktop two-column layout */}
            <div className="container mx-auto px-4 h-full flex items-center">
                <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-16 max-w-[1100px] mx-auto">

                    {/* LEFT: Illustration Section - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:flex flex-1 items-center justify-center">
                        <div className="relative w-full max-w-lg">
                            {/* Decorative background shapes */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A7DCE8] rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F6C343] rounded-full opacity-20 blur-3xl"></div>

                            {/* Illustration Placeholder - Replace with actual SVG */}
                            <div className="relative bg-white rounded-[24px] p-8 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-24 h-24 flex items-center justify-center">
                                        <img src="/logo.png" alt="PetVault" className="w-24 h-24" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-[#0E2F44]">
                                            Your Pet's Health,
                                        </h3>
                                        <h3 className="text-xl font-bold text-[#49B3E8]">
                                            All In One Place
                                        </h3>
                                        <p className="text-sm text-[#6F8A96] mt-2">
                                            Track appointments, vaccinations, and health records with ease.
                                        </p>
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="flex gap-3 mt-4">
                                        <div className="w-2 h-2 rounded-full bg-[#49B3E8]"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#F6C343]"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#32C36C]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Login Card */}
                    <div className="w-full lg:flex-1 max-w-[420px] mx-auto lg:mx-0">
                        <div className="bg-white rounded-[24px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] p-[28px] md:p-[36px] lg:p-[40px]">
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
                                    Welcome Back
                                </h1>
                                <p className="text-sm text-[#6F8A96] leading-relaxed">
                                    Continue your pet's health journey.
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
                                        className="h-11 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] transition-all bg-[#F2FAFD] text-[#0E2F44] placeholder:text-[#6F8A96]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-[#0E2F44]">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 rounded-full border-2 border-[#E5F4F9] focus:border-[#49B3E8] transition-all bg-[#F2FAFD] text-[#0E2F44]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold text-base"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <>Sign In</>
                                    )}
                                </Button>
                            </form>

                            {/* Footer Links */}
                            <div className="mt-6 text-center space-y-3">
                                <p className="text-sm text-[#6F8A96]">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/signup"
                                        className="text-[#49B3E8] hover:text-[#32C36C] font-semibold transition-colors"
                                    >
                                        Sign up free
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
                </div>
            </div>
        </div>
    );
}
