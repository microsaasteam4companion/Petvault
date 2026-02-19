import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, PawPrint } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Timeline", href: "#timeline" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "/blogs", isInternal: true },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[50] bg-white/95 backdrop-blur-sm border-b border-[#E5F4F9] shadow-sm">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F6C343] flex items-center justify-center shadow-sm">
              <PawPrint className="w-5 h-5 text-[#0E2F44]" />
            </div>
            <span className="font-poppins font-bold text-xl tracking-tight text-[#0E2F44]">PetVault</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 ml-10">
            {navLinks.map((link) => (
              link.isInternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[#0E2F44]/80 hover:text-[#0E2F44] font-medium text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#0E2F44]/80 hover:text-[#0E2F44] font-medium text-sm transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="rounded-full text-[#6F8A96]" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" className="rounded-full border-[#E5F4F9]" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="rounded-full text-[#6F8A96]" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] text-white hover:shadow-lg transition-all"
                >
                  Start Free
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-[#0E2F44]">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full rounded-b-[32px] border-none p-6 pt-12">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F6C343] flex items-center justify-center">
                      <PawPrint className="w-4 h-4 text-[#0E2F44]" />
                    </div>
                    PetVault
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation menu for mobile devices
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    link.isInternal ? (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="block py-4 text-lg font-semibold text-[#0E2F44] hover:text-[#49B3E8] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block py-4 text-lg font-semibold text-[#0E2F44] hover:text-[#49B3E8] transition-colors"
                      >
                        {link.label}
                      </a>
                    )
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-[#E5F4F9] space-y-3">
                  {user ? (
                    <>
                      <Button
                        className="w-full h-12 rounded-full"
                        onClick={() => navigate('/dashboard')}
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-full border-[#E5F4F9]"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full h-12 rounded-full bg-gradient-to-r from-[#49B3E8] to-[#A7DCE8] text-white"
                        onClick={() => navigate('/signup')}
                      >
                        Get Started
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-full border-[#E5F4F9]"
                        onClick={() => navigate('/login')}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

