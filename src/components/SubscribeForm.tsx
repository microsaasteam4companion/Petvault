import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscribeFormProps {
    variant?: "hero" | "footer"; // Different styling for different locations
    compact?: boolean;
}

const SubscribeForm = ({ variant = "hero", compact = false }: SubscribeFormProps) => {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !validateEmail(email)) {
            setError("Please enter a valid email address");
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please enter a valid email address.",
            });
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { error: dbError } = await supabase
                .from("subscribers")
                .insert([{ email: email.toLowerCase().trim() }]);

            if (dbError) {
                // Check if it's a duplicate email error
                if (dbError.code === "23505") {
                    setError("This email is already subscribed");
                    toast({
                        title: "Already Subscribed",
                        description: "This email is already part of our community!",
                    });
                } else {
                    const errorMsg = dbError.message || "Something went wrong. Please try again.";
                    setError(`Error: ${errorMsg}`);
                    toast({
                        variant: "destructive",
                        title: "Subscription Failed",
                        description: errorMsg,
                    });
                }
                setLoading(false);
                return;
            }

            // Success!
            setSuccess(true);
            setEmail("");

            toast({
                title: "Subscribed Successfully!",
                description: "Thanks for joining the PetVault community!",
            });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } catch (err: any) {
            const errorMsg = err.message || "Something went wrong. Please try again.";
            setError(errorMsg);
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    // Hero variant styling (after hero section)
    if (variant === "hero") {
        return (
            <div className="w-full">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 mb-3">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter your email"
                        disabled={loading || success}
                        className="flex-1 h-12 px-5 rounded-pill bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm
              focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(199,76%,60%,0.12)] transition-all duration-200"
                    />
                    <Button
                        type="submit"
                        disabled={loading || success}
                        className="h-12 px-8 rounded-pill font-semibold text-sm text-primary-foreground
              bg-gradient-to-r from-primary to-[hsl(199,80%,50%)] shadow-[0_4px_16px_hsl(199,76%,60%,0.25)]
              hover:shadow-[0_4px_24px_hsl(199,76%,60%,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 will-change-transform whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subscribing...</>
                        ) : success ? (
                            <><Check className="w-4 h-4 mr-2" /> Subscribed!</>
                        ) : (
                            "Subscribe"
                        )}
                    </Button>
                </form>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                {success && (
                    <p className="text-sm text-success font-medium">
                        You're now part of the PetVault community.
                    </p>
                )}
            </div>
        );
    }

    // Footer variant styling
    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                    placeholder="Enter your email"
                    disabled={loading || success}
                    className="h-9 px-4 rounded-pill bg-white/8 border border-white/12 text-primary-foreground placeholder:text-primary-foreground/40 text-xs
            focus:outline-none focus:border-primary/60 transition-all duration-200 w-full sm:w-52"
                />
                <button
                    type="submit"
                    disabled={loading || success}
                    className="h-9 px-5 rounded-pill font-semibold text-xs text-white
            bg-gradient-to-r from-primary to-[hsl(199,80%,50%)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : success ? (
                        <Check className="w-3 h-3" />
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </form>

            {error && (
                <p className="text-xs text-red-300 mt-1">{error}</p>
            )}

            {success && (
                <p className="text-xs text-green-300 mt-1 font-medium">
                    You're now part of the PetVault community.
                </p>
            )}
        </div>
    );
};

export default SubscribeForm;
